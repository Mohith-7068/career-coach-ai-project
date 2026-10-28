import React, { useState } from "react";
import { usePageState } from "@/lib/usePageState";
import { base44 } from "@/api/base44Client";
import { awardCoins, setScores } from "@/lib/careerState";
import { FILLER_WORDS } from "@/lib/careerData";
import PageHeader from "@/components/ui/PageHeader";
import PrimaryButton from "@/components/ui/PrimaryButton";
import ErrorBanner from "@/components/ui/ErrorBanner";
import ScoreBar from "@/components/ui/ScoreBar";
import SessionAnalysis from "@/components/interview/SessionAnalysis";
import MicCapture from "@/components/interview/MicCapture";
import VideoCapture from "@/components/interview/VideoCapture";

const MODES = [
    { id: "standard", label: "💬 Standard" },
    { id: "mic", label: "🎙️ Microphone" },
    { id: "video", label: "📹 Video" },
];

const MAX_QUESTIONS = 5;

export default function Interview() {
    const { state, refresh } = usePageState();
    const [mode, setMode] = useState("standard");
    const [role, setRole] = useState(state?.target_role || "Software Engineer");
    const [level, setLevel] = useState(state?.experience_level || "entry");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [session, setSession] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [current, setCurrent] = useState(0);
    const [draft, setDraft] = useState("");
    const [evaluating, setEvaluating] = useState(false);
    const [lastEval, setLastEval] = useState(null);
    const [rewarded, setRewarded] = useState(false);
    const [finishing, setFinishing] = useState(false);

    async function start() {
        setLoading(true);
        setError("");
        setSession(null);
        setAnswers([]);
        setCurrent(0);
        setDraft("");
        setLastEval(null);
        setRewarded(false);
        try {
            const res = await base44.functions.invoke("interviewQuestions", {
                role,
                experience_level: level,
                skills: state?.last_resume_skills || [],
            });
            const data = res?.data ?? res;
            if (data?.error) {
                setError(data.error);
                setLoading(false);
                return;
            }
            // Safeguard: normalize and cap questions array
            const rawQuestions = Array.isArray(data?.questions) ? data.questions : [];
            const questions = rawQuestions.slice(0, MAX_QUESTIONS).map((q, idx) => {
                if (typeof q === "string") {
                    return { question_text: q, question_type: `Question ${idx + 1}` };
                }
                return {
                    question_text: q.question_text || `Question ${idx + 1}`,
                    question_type: q.question_type || "Technical & Behavioral"
                };
            });

            if (questions.length === 0) {
                setError("No usable interview questions were returned. Please try again.");
                setLoading(false);
                return;
            }

            const created = await base44.entities.InterviewSession.create({
                role,
                experience_level: level,
                questions,
                answers: [],
                completed: false,
            });
            setSession(created);
        } catch (e) {
            setError(e.message || "Something went wrong generating interview questions — please try again.");
        } finally {
            setLoading(false);
        }
    }

    // Shared answer submission — works for typed (standard) and transcribed (mic/video) answers.
    async function submitAnswer(text, videoAnalysis = null, speechAnalysis = null) {
        if (!text || !text.trim()) return;
        setEvaluating(true);
        setError("");
        try {
            const q = session.questions[current];
            const res = await base44.functions.invoke("evaluateAnswer", {
                question_text: q.question_text,
                answer_text: text,
                role,
            });
            const data = res?.data ?? res;
            if (data?.error) {
                setError(data.error);
                setEvaluating(false);
                return;
            }

            // Derive speech & transcript cadence metrics
            const words = text.trim().split(/\s+/).filter(Boolean);
            const wordCount = words.length;
            const lowerText = ` ${text.toLowerCase().replace(/[^a-z' ]/g, " ").replace(/\s+/g, " ")} `;
            let fillerCount = 0;
            const fillerWordsFound = [];
            for (const fw of FILLER_WORDS) {
                const escaped = fw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
                const m = lowerText.match(new RegExp(`(^|[^a-z])${escaped}([^a-z]|$)`, "g"));
                if (m && m.length > 0) {
                    fillerCount += m.length;
                    fillerWordsFound.push(fw);
                }
            }
            const fillerRate = wordCount > 0 ? Math.round((fillerCount / wordCount) * 1000) / 10 : 0;
            const durationSec = speechAnalysis?.duration_seconds || videoAnalysis?.duration_seconds || 0;
            const wpm = durationSec > 2 && wordCount > 0 ? Math.round((wordCount / durationSec) * 60) : null;

            const speechReport = {
                word_count: wordCount,
                duration_seconds: durationSec,
                wpm,
                filler_count: fillerCount,
                filler_rate: fillerRate,
                filler_words_found: fillerWordsFound,
                spoken: mode !== "standard"
            };

            const entry = {
                question_text: q.question_text,
                question_type: q.question_type,
                answer_text: text,
                ...data,
                speech_analysis: speechReport,
                ...(mode === "video" && videoAnalysis ? { video_analysis: videoAnalysis } : {}),
            };
            const updatedAnswers = [...answers, entry];
            setAnswers(updatedAnswers);
            setLastEval(data);
            setDraft("");
            await base44.entities.InterviewSession.update(session.id, { answers: updatedAnswers });
        } catch (e) {
            setError(e.message || "Evaluation failed — please try again.");
        } finally {
            setEvaluating(false);
        }
    }

    function next() {
        const total = session?.questions?.length || 0;
        if (current < total - 1) {
            setCurrent((c) => c + 1);
            setLastEval(null);
            setDraft("");
            setError("");
        } else {
            finish();
        }
    }

    // Single completion path — transitions state to "completed: true" and calculates final metrics
    async function finish() {
        if (answers.length === 0) {
            setError("Answer at least one question before generating the analysis.");
            return;
        }
        setFinishing(true);
        setError("");
        try {
            const avg = Math.round(
                answers.reduce((sum, a) => sum + (a.score || 0), 0) / Math.max(answers.length, 1)
            );
            const updated = await base44.entities.InterviewSession.update(session.id, {
                answers,
                average_score: avg,
                completed: true,
            });
            setSession(updated);

            if (state) {
                const newInterview = Math.round((state.interview_score || 70) * 0.6 + avg * 0.4);
                const nextState = await setScores(state, { interview_score: newInterview });
                const fresh = await awardCoins(nextState, {
                    amount: 35,
                    xp: 50,
                    transaction_type: "REWARD_CLAIM",
                    description: "Interview Session Deep Review",
                    reference_id: `deepreview_${updated.id}`,
                });
                if (fresh.coin_balance !== nextState.coin_balance) setRewarded(true);
                await refresh();
            }
        } catch (e) {
            setError("Failed to complete session analysis. Please try again.");
        } finally {
            setFinishing(false);
        }
    }

    const total = session?.questions?.length || 0;
    const isLast = current >= total - 1;

    return (
        <div>
            <PageHeader
                eyebrow="AI Mock Interview Studio"
                title="AI Mock Interview Studio"
                subtitle="Resume-grounded questions, STAR-structured answer evaluation, and a full session deep review."
            />

            {/* Mode toggle */}
            <div className="bg-[#FAF7F0] p-1 rounded-lg border border-[#E5E0D5] w-fit mb-8">
                <div className="flex">
                    {MODES.map((m) => (
                        <button
                            key={m.id}
                            onClick={() => setMode(m.id)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${mode === m.id
                                    ? "bg-[#174A3A] text-white shadow-sm"
                                    : "text-[#68665F] hover:text-[#1C1C1A] hover:bg-white"
                                }`}
                        >
                            {m.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Configure screen — shared across modes */}
            {!session && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="editorial-panel p-7 rounded-lg">
                            <p className="eyebrow mb-4">Configure Session</p>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-[#1C1C1A] block mb-1.5">Target Job Role</label>
                                    <input
                                        className="input-editorial"
                                        value={role}
                                        onChange={(e) => setRole(e.target.value)}
                                        placeholder="e.g. Senior Backend Engineer"
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-[#1C1C1A] block mb-1.5">Experience Level</label>
                                    <select className="input-editorial" value={level} onChange={(e) => setLevel(e.target.value)}>
                                        <option value="entry">Entry Level</option>
                                        <option value="mid">Mid Level</option>
                                        <option value="senior">Senior Level</option>
                                    </select>
                                </div>
                                {error && <ErrorBanner message={error} onRetry={start} />}
                                <PrimaryButton loading={loading} onClick={start} disabled={!role || loading}>
                                    {loading ? "Generating questions…" : "Launch Interactive AI Mock Interview Session"}
                                </PrimaryButton>
                            </div>
                            {state?.last_resume_skills?.length > 0 && (
                                <div className="mt-5 pt-5 border-t border-[#E5E0D5]">
                                    <p className="eyebrow mb-2">Grounding Skills (from your resume)</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {state.last_resume_skills.map((s) => (
                                            <span key={s} className="badge-forest px-2.5 py-1 rounded-full text-xs">{s}</span>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <div className="editorial-card p-6 rounded-md">
                            <p className="eyebrow mb-3">Evaluation Criteria</p>
                            <ul className="space-y-3 text-sm">
                                <li className="flex justify-between"><span className="text-[#1C1C1A]">Relevance</span><span className="text-[#68665F] font-semibold">35%</span></li>
                                <li className="flex justify-between"><span className="text-[#1C1C1A]">Clarity</span><span className="text-[#68665F] font-semibold">30%</span></li>
                                <li className="flex justify-between"><span className="text-[#1C1C1A]">Correctness (STAR)</span><span className="text-[#68665F] font-semibold">35%</span></li>
                            </ul>
                            <p className="text-xs text-[#68665F] mt-4 pt-4 border-t border-[#E5E0D5]">
                                STAR = Situation, Task, Action, Result. Answers with all four and quantified outcomes score highest.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* In-progress interview — shared question flow */}
            {session && !session.completed && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Progress */}
                        <div className="flex items-center gap-3 text-xs text-[#68665F]">
                            <span className="font-semibold text-[#174A3A]">Question {current + 1} of {total}</span>
                            <div className="flex gap-1">
                                {session.questions.map((_, i) => (
                                    <div
                                        key={i}
                                        className={`w-6 h-1.5 rounded-full ${i < current ? "bg-[#174A3A]" : i === current ? "bg-[#C8922E]" : "bg-[#E5E0D5]"}`}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Question */}
                        <div className="editorial-panel p-7 rounded-lg border-l-4 border-l-[#174A3A]">
                            <p className="eyebrow mb-2 text-[#174A3A]">{session.questions[current]?.question_type}</p>
                            <p className="text-lg font-semibold text-[#1C1C1A] leading-snug">
                                {session.questions[current]?.question_text}
                            </p>
                        </div>

                        {/* Answer — mode-specific capture */}
                        <div className="editorial-panel p-7 rounded-lg">
                            <p className="eyebrow mb-3">Your Answer</p>

                            {mode === "standard" && (
                                <>
                                    <textarea
                                        className="input-editorial min-h-40"
                                        placeholder="Structure your answer using STAR: Situation, Task, Action, Result…"
                                        value={draft}
                                        onChange={(e) => setDraft(e.target.value)}
                                        disabled={!!lastEval}
                                    />
                                    {!lastEval && (
                                        <div className="mt-4">
                                            <PrimaryButton
                                                loading={evaluating}
                                                onClick={() => submitAnswer(draft)}
                                                disabled={!draft.trim() || evaluating}
                                            >
                                                {evaluating ? "Evaluating STAR Answer…" : "Submit Answer"}
                                            </PrimaryButton>
                                        </div>
                                    )}
                                </>
                            )}

                            {mode === "mic" && (
                                <MicCapture
                                    key={current}
                                    submitted={!!lastEval}
                                    onSubmit={submitAnswer}
                                    evaluating={evaluating}
                                />
                            )}

                            {mode === "video" && (
                                <VideoCapture
                                    key={current}
                                    submitted={!!lastEval}
                                    onSubmit={submitAnswer}
                                    evaluating={evaluating}
                                    onSwitchMode={setMode}
                                />
                            )}

                            {error && (
                                <div className="mt-3">
                                    <ErrorBanner message={error} onRetry={() => submitAnswer(draft)} />
                                </div>
                            )}

                            {/* Shared completion actions */}
                            <div className="mt-4 flex flex-wrap gap-3">
                                {lastEval && !isLast && (
                                    <button onClick={next} className="btn-primary px-6 py-3.5 font-semibold rounded-md text-sm shadow-sm">
                                        Next Question →
                                    </button>
                                )}
                                {lastEval && isLast && (
                                    <button
                                        onClick={finish}
                                        disabled={finishing}
                                        className="btn-primary px-6 py-3.5 font-semibold rounded-md text-sm shadow-sm"
                                    >
                                        {finishing ? "Generating analysis…" : "Finish Session & Generate Analysis →"}
                                    </button>
                                )}
                                {answers.length > 0 && !lastEval && (
                                    <button
                                        onClick={finish}
                                        disabled={finishing}
                                        className="px-6 py-3.5 font-semibold rounded-md text-sm border border-[#D9D3C7] text-[#68665F] hover:text-[#1C1C1A] hover:bg-[#FAF7F0] transition-all"
                                    >
                                        End Session & Generate Analysis
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: feedback */}
                    <div className="space-y-6">
                        {lastEval ? (
                            <div className="editorial-card p-6 rounded-md">
                                <p className="eyebrow mb-3">Response Feedback</p>
                                <div className="flex items-baseline gap-1 mb-4">
                                    <span className="text-4xl font-bold text-[#174A3A]">{lastEval.score}</span>
                                    <span className="text-xs text-[#68665F]">/100</span>
                                </div>
                                <ScoreBar value={lastEval.score} />

                                <div className="mt-4 space-y-3">
                                    <ScoreRow label="Relevance" value={lastEval.relevance} />
                                    <ScoreRow label="Clarity" value={lastEval.clarity} />
                                    <ScoreRow label="Correctness" value={lastEval.correctness} />
                                </div>

                                <div className="mt-5 pt-4 border-t border-[#E5E0D5]">
                                    <p className="text-xs font-semibold text-[#68665F] mb-2">STAR Detection</p>
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        {["situation", "task", "action", "result"].map((k) => (
                                            <span
                                                key={k}
                                                className={`px-2 py-1 rounded-md font-medium capitalize ${lastEval.star?.[k] ? "bg-[#E8F2EE] text-[#174A3A]" : "bg-[#FAF7F0] text-[#68665F] border border-[#E5E0D5]"
                                                    }`}
                                            >
                                                {lastEval.star?.[k] ? "✓" : "○"} {k}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="editorial-card p-6 rounded-md">
                                <p className="eyebrow mb-3">Interview Tips</p>
                                <ul className="space-y-2 text-sm text-[#1C1C1A]">
                                    <li className="flex gap-2"><span className="text-[#174A3A]">→</span> Set the scene before describing action.</li>
                                    <li className="flex gap-2"><span className="text-[#174A3A]">→</span> Use "I" statements, not "we".</li>
                                    <li className="flex gap-2"><span className="text-[#174A3A]">→</span> Quantify outcomes with numbers.</li>
                                    <li className="flex gap-2"><span className="text-[#174A3A]">→</span> Aim for 80–180 words per answer.</li>
                                </ul>
                            </div>
                        )}

                        {lastEval?.strengths?.length > 0 && (
                            <FeedbackList title="Strengths" items={lastEval.strengths} color="#2F6B57" mark="✓" />
                        )}
                        {lastEval?.recommendations?.length > 0 && (
                            <FeedbackList title="Recommendations" items={lastEval.recommendations} color="#C8922E" mark="→" />
                        )}
                    </div>
                </div>
            )}

            {/* Completed session — shared analysis screen for all three modes */}
            {session?.completed && (
                <SessionAnalysis session={session} rewarded={rewarded} onRestart={start} />
            )}
        </div>
    );
}

function ScoreRow({ label, value }) {
    return (
        <div>
            <div className="flex justify-between text-xs mb-1">
                <span className="text-[#1C1C1A] font-medium">{label}</span>
                <span className="text-[#68665F] font-semibold">{Math.round(value)}</span>
            </div>
            <ScoreBar value={value} color="#2F6B57" />
        </div>
    );
}

function FeedbackList({ title, items, color, mark }) {
    return (
        <div className="editorial-card p-5 rounded-md">
            <p className="eyebrow mb-3" style={{ color }}>{title}</p>
            <ul className="space-y-1.5">
                {items.map((s, i) => (
                    <li key={i} className="text-sm text-[#1C1C1A] flex gap-2">
                        <span style={{ color }}>{mark}</span>
                        <span>{s}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}