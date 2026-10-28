import React, { useState } from "react";
import ScoreBar from "@/components/ui/ScoreBar";

// Renders the end-of-session comprehensive analysis and transcript report.
// Shown only when session.completed === true.
export default function SessionAnalysis({ session, rewarded, onRestart }) {
    const [copied, setCopied] = useState(false);
    const answers = session?.answers || [];
    const avg = session?.average_score ?? 0;
    const total = answers.length;

    // Aggregate top strengths + recommendations across all answers
    const allStrengths = answers.flatMap((a) => a.strengths || []).slice(0, 6);
    const allRecs = answers.flatMap((a) => a.recommendations || []).slice(0, 6);

    // Compute aggregate speech cadence metrics
    const answersWithSpeech = answers.filter((a) => a.speech_analysis);
    const totalWords = answers.reduce((acc, a) => {
        if (a.speech_analysis?.word_count) return acc + a.speech_analysis.word_count;
        const count = (a.answer_text || "").trim().split(/\s+/).filter(Boolean).length;
        return acc + count;
    }, 0);

    const answersWithWpm = answers.filter((a) => a.speech_analysis?.wpm);
    const avgWpm = answersWithWpm.length > 0
        ? Math.round(answersWithWpm.reduce((acc, a) => acc + a.speech_analysis.wpm, 0) / answersWithWpm.length)
        : null;

    const totalFillers = answers.reduce((acc, a) => acc + (a.speech_analysis?.filler_count || 0), 0);
    const allFillersFound = Array.from(
        new Set(answers.flatMap((a) => a.speech_analysis?.filler_words_found || []))
    );
    const totalSpokenDuration = answers.reduce((acc, a) => acc + (a.speech_analysis?.duration_seconds || 0), 0);

    // Compute aggregate video observations
    const answersWithVideo = answers.filter((a) => a.video_analysis);
    const avgFaceVisible = answersWithVideo.length > 0
        ? Math.round(answersWithVideo.reduce((acc, a) => acc + (a.video_analysis.face_visible_percent || 0), 0) / answersWithVideo.length)
        : null;
    const avgCentered = answersWithVideo.length > 0
        ? Math.round(answersWithVideo.reduce((acc, a) => acc + (a.video_analysis.centered_percent ?? a.video_analysis.centered_when_visible_percent ?? 0), 0) / answersWithVideo.length)
        : null;
    const avgFacingScreen = answersWithVideo.length > 0
        ? Math.round(answersWithVideo.reduce((acc, a) => acc + (a.video_analysis.facing_screen_percent ?? a.video_analysis.head_stability_percent ?? 0), 0) / answersWithVideo.length)
        : null;
    const screenFacingStatus = answersWithVideo[0]?.video_analysis?.screen_facing_status || (
        avgFacingScreen !== null
            ? avgFacingScreen >= 75 ? "Consistently Facing Screen" : avgFacingScreen >= 50 ? "Generally Facing Screen" : "Frequently Turned Away"
            : "N/A"
    );
    const cameraDeviceUsed = answersWithVideo[0]?.video_analysis?.camera_device_used || "Default System Camera";

    // Format full session report for clipboard copying
    function handleCopyReport() {
        const lines = [
            `# Career Coach AI — Interview Analysis Report`,
            `Role: ${session?.role || "Interview Candidate"} | Overall Score: ${avg}/100`,
            `Questions Evaluated: ${total} | Total Words: ${totalWords}${avgWpm ? ` | Average Pace: ${avgWpm} WPM` : ""}`,
            `Camera Used: ${cameraDeviceUsed}`,
            ``,
            `## Scoring Methodology`,
            `Score Weighting: Relevance (35%) + Clarity (30%) + Technical/STAR Correctness (35%)`,
            ``,
            `## Summary Speech & Video Signals`,
            `- Total Spoken Duration: ${Math.round(totalSpokenDuration)}s`,
            `- Fillers Detected: ${totalFillers}${allFillersFound.length > 0 ? ` (${allFillersFound.join(", ")})` : " (None)"}`,
            avgFaceVisible !== null ? `- Face Visibility: ${avgFaceVisible}% | Centered in Frame: ${avgCentered}% | Screen Facing: ${avgFacingScreen}% (${screenFacingStatus})` : `- Video: Camera was off or preview mode`,
            ``,
            `## Key Strengths`,
            ...allStrengths.map((s) => `- ${s}`),
            ``,
            `## Recommendations`,
            ...allRecs.map((r) => `- ${r}`),
            ``,
            `## Complete Transcript & Answer-by-Answer Evaluation`,
            ...answers.flatMap((a, idx) => [
                `### Q${idx + 1} (${a.question_type || "Question"}): ${a.question_text}`,
                `**Answer**: "${a.answer_text}"`,
                `**Score**: ${a.score}/100 (Relevance: ${a.relevance}, Clarity: ${a.clarity}, Correctness: ${a.correctness})`,
                a.star ? `**STAR**: Situation: ${a.star.situation ? "Yes" : "No"} | Task: ${a.star.task ? "Yes" : "No"} | Action: ${a.star.action ? "Yes" : "No"} | Result: ${a.star.result ? "Yes" : "No"}` : ``,
                a.speech_analysis?.wpm ? `**Speech**: ${a.speech_analysis.wpm} WPM | ${a.speech_analysis.word_count} words | ${a.speech_analysis.filler_count} fillers` : ``,
                a.video_analysis ? `**Video**: Face ${a.video_analysis.face_visible_percent}% | Centered ${a.video_analysis.centered_percent ?? a.video_analysis.centered_when_visible_percent}% | Screen Facing ${a.video_analysis.facing_screen_percent ?? a.video_analysis.head_stability_percent ?? 0}% (${a.video_analysis.screen_facing_status || "Screen Facing Active"})` : ``,
                `---`
            ])
        ];

        navigator.clipboard.writeText(lines.join("\n")).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2500);
        });
    }

    return (
        <div className="space-y-6">
            {/* Headline result */}
            <div className="editorial-panel p-7 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="eyebrow text-[#174A3A]">Session Complete</p>
                        <p className="text-xl font-bold text-[#1C1C1A] mt-1">Interview Analysis &amp; Comprehensive Report</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={handleCopyReport}
                            className="px-3 py-1.5 rounded-md border border-[#D9D3C7] bg-white text-xs font-semibold text-[#174A3A] hover:bg-[#FAF7F0] transition-colors shadow-xs"
                        >
                            {copied ? "✓ Report Copied!" : "📋 Copy Full Report"}
                        </button>
                        <span className="badge-forest px-3 py-1.5 rounded-full text-xs font-semibold">Completed</span>
                    </div>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                    <span className="text-5xl font-bold text-[#174A3A]">{avg}</span>
                    <span className="text-sm text-[#68665F]">/100 overall · {total} {total === 1 ? "answer" : "answers"} evaluated</span>
                </div>
                <ScoreBar value={avg} />

                {rewarded && (
                    <p className="mt-4 text-sm font-semibold text-[#174A3A]">
                        🎉 Deep review reward claimed: +35 Coins, +50 XP
                    </p>
                )}
            </div>

            {/* Speech Cadence & Video Signal Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Speech Metrics */}
                <div className="editorial-card p-6 rounded-md">
                    <div className="flex items-center justify-between mb-3">
                        <p className="eyebrow" style={{ color: "#174A3A" }}>Speech Cadence &amp; Transcript Stats</p>
                        <span className="text-xs font-semibold text-[#68665F]">
                            {answersWithSpeech.length > 0 ? "Measured via Audio" : "Calculated from Transcript"}
                        </span>
                    </div>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                        <div className="bg-[#FAF7F0] p-3 rounded border border-[#E5E0D5]">
                            <span className="text-[10px] text-[#68665F] uppercase font-bold block">Total Words</span>
                            <span className="text-xl font-bold text-[#1C1C1A]">{totalWords}</span>
                        </div>
                        <div className="bg-[#FAF7F0] p-3 rounded border border-[#E5E0D5]">
                            <span className="text-[10px] text-[#68665F] uppercase font-bold block">Speaking Pace</span>
                            <span className="text-xl font-bold text-[#1C1C1A]">
                                {avgWpm ? `${avgWpm} WPM` : "—"}
                            </span>
                        </div>
                        <div className="bg-[#FAF7F0] p-3 rounded border border-[#E5E0D5]">
                            <span className="text-[10px] text-[#68665F] uppercase font-bold block">Filler Words</span>
                            <span className="text-xl font-bold text-[#1C1C1A]">{totalFillers}</span>
                        </div>
                    </div>
                    {allFillersFound.length > 0 ? (
                        <div className="text-xs text-[#68665F]">
                            <strong className="text-[#1C1C1A]">Tracked fillers detected:</strong> {allFillersFound.join(", ")}
                        </div>
                    ) : (
                        <p className="text-xs text-[#2F6B57]">✓ Zero filler words detected across all evaluated answers.</p>
                    )}
                </div>

                {/* Video & Posture Signals */}
                <div className="editorial-card p-6 rounded-md">
                    <div className="flex items-center justify-between mb-3">
                        <p className="eyebrow" style={{ color: "#174A3A" }}>Video Framing &amp; Screen Orientation</p>
                        <span className="text-xs font-semibold text-[#68665F] truncate max-w-[160px]" title={cameraDeviceUsed}>
                            📷 {cameraDeviceUsed}
                        </span>
                    </div>
                    {avgFaceVisible !== null ? (
                        <>
                            <div className="grid grid-cols-3 gap-2 mb-3 text-center">
                                <div className="bg-[#FAF7F0] p-2.5 rounded border border-[#E5E0D5]">
                                    <span className="text-[10px] text-[#68665F] uppercase font-bold block">Face Visible</span>
                                    <span className="text-lg font-bold text-[#1C1C1A]">{avgFaceVisible}%</span>
                                </div>
                                <div className="bg-[#FAF7F0] p-2.5 rounded border border-[#E5E0D5]">
                                    <span className="text-[10px] text-[#68665F] uppercase font-bold block">Centered</span>
                                    <span className="text-lg font-bold text-[#1C1C1A]">{avgCentered}%</span>
                                </div>
                                <div className="bg-[#FAF7F0] p-2.5 rounded border border-[#E5E0D5]">
                                    <span className="text-[10px] text-[#68665F] uppercase font-bold block">Facing Screen</span>
                                    <span className="text-lg font-bold text-[#1C1C1A]">{avgFacingScreen}%</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-xs py-1 px-2.5 bg-[#FAF7F0] rounded border border-[#E5E0D5] mb-2">
                                <span className="text-[#68665F] font-medium">Screen Orientation:</span>
                                <span className="font-semibold text-[#174A3A]">{screenFacingStatus}</span>
                            </div>
                            <p className="text-[10px] text-[#68665F]">
                                Objective framing and screen-facing posture measured via 3D facial landmark geometry. Evaluates whether the candidate remained appropriately centered and oriented toward the screen.
                            </p>
                        </>
                    ) : (
                        <p className="text-xs text-[#68665F] mt-2">
                            Video capture was not enabled for this interview session. Camera metrics are recorded when video mode is active.
                        </p>
                    )}
                </div>
            </div>

            {/* Answer-by-Answer Breakdown */}
            <div className="editorial-panel p-7 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <p className="eyebrow">Answer-by-Answer Evaluation &amp; Transcripts</p>
                    <span className="text-xs text-[#68665F]">Formula: 35% Relevance + 30% Clarity + 35% Correctness</span>
                </div>

                <div className="space-y-5">
                    {answers.map((a, i) => (
                        <div key={i} className="border border-[#E5E0D5] rounded-md p-5 bg-[#FAF7F0]">
                            <div className="flex items-start justify-between gap-3 mb-2">
                                <div className="flex-1">
                                    <p className="text-[10px] font-bold tracking-wider uppercase text-[#68665F]">
                                        Q{i + 1} · {a.question_type || "Question"}
                                    </p>
                                    <p className="text-sm font-semibold text-[#1C1C1A] mt-0.5">{a.question_text}</p>
                                </div>
                                <div className="text-right shrink-0">
                                    <span className="text-2xl font-bold text-[#174A3A]">{a.score}</span>
                                    <span className="text-xs text-[#68665F]">/100</span>
                                </div>
                            </div>

                            {/* Spoken Answer Transcript */}
                            <div className="mb-3">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-[#68665F] block mb-1">
                                    Transcript Answer:
                                </span>
                                <p className="text-xs text-[#1C1C1A] bg-white border border-[#E5E0D5] rounded p-3 leading-relaxed whitespace-pre-wrap">
                                    {a.answer_text}
                                </p>
                            </div>

                            {/* Subscores Grid */}
                            <div className="grid grid-cols-3 gap-3 mb-3">
                                <MiniScore label="Relevance (35%)" value={a.relevance} />
                                <MiniScore label="Clarity (30%)" value={a.clarity} />
                                <MiniScore label="Correctness (35%)" value={a.correctness} />
                            </div>

                            {/* STAR indicators */}
                            {a.star && (
                                <div className="flex flex-wrap items-center gap-2 mb-3">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#68665F]">
                                        STAR Structure:
                                    </span>
                                    {["situation", "task", "action", "result"].map((k) => (
                                        <span
                                            key={k}
                                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize ${
                                                a.star[k]
                                                    ? "bg-[#E8F2EE] text-[#174A3A] border border-[#B8DACD]"
                                                    : "bg-white text-[#68665F] border border-[#E5E0D5]"
                                            }`}
                                        >
                                            {a.star[k] ? "✓" : "○"} {k}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Speech Analysis for this specific answer */}
                            {a.speech_analysis && (
                                <div className="mb-3 rounded-md border border-[#E5E0D5] bg-white p-3">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#174A3A]">Speech Cadence</p>
                                        {a.speech_analysis.duration_seconds && (
                                            <span className="text-[10px] text-[#68665F] font-semibold">
                                                Duration: {a.speech_analysis.duration_seconds}s
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-xs">
                                        <div><span className="text-[#68665F]">Pace:</span> <strong>{a.speech_analysis.wpm ? `${a.speech_analysis.wpm} WPM` : "Calculated from text"}</strong></div>
                                        <div><span className="text-[#68665F]">Words:</span> <strong>{a.speech_analysis.word_count}</strong></div>
                                        <div><span className="text-[#68665F]">Fillers:</span> <strong>{a.speech_analysis.filler_count}</strong></div>
                                        {a.speech_analysis.filler_words_found?.length > 0 && (
                                            <div><span className="text-[#68665F]">Words flagged:</span> <strong className="text-[#A44732]">{a.speech_analysis.filler_words_found.join(", ")}</strong></div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Video observations for this specific answer */}
                            {a.video_analysis && (
                                <div className="mt-3 rounded-md border border-[#D9E6DF] bg-[#F3F8F5] p-3">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#174A3A]">Video Framing &amp; Screen Orientation</p>
                                        <span className="text-[10px] text-[#68665F]">{a.video_analysis.camera_device_used || "Webcam"}</span>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div><span className="text-[#68665F] block">Face visible</span><strong>{a.video_analysis.face_visible_percent}%</strong></div>
                                        <div><span className="text-[#68665F] block">Centered</span><strong>{a.video_analysis.centered_percent ?? a.video_analysis.centered_when_visible_percent ?? 0}%</strong></div>
                                        <div><span className="text-[#68665F] block">Facing screen</span><strong>{a.video_analysis.facing_screen_percent ?? a.video_analysis.head_stability_percent ?? 0}%</strong></div>
                                    </div>
                                    {a.video_analysis.screen_facing_status && (
                                        <div className="mt-2 text-[11px] text-[#174A3A] font-medium bg-white/70 px-2 py-1 rounded border border-[#D9E6DF] flex items-center justify-between">
                                            <span>Orientation Assessment:</span>
                                            <span className="font-semibold">{a.video_analysis.screen_facing_status}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Strengths */}
                            {a.strengths?.length > 0 && (
                                <div className="mt-3">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#2F6B57] mb-1">Answer Strengths</p>
                                    <ul className="space-y-1">
                                        {a.strengths.slice(0, 3).map((s, j) => (
                                            <li key={j} className="text-xs text-[#1C1C1A] flex gap-1.5">
                                                <span className="text-[#2F6B57] font-bold">✓</span> {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Recommendations */}
                            {a.recommendations?.length > 0 && (
                                <div className="mt-2.5">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#C8922E] mb-1">Target Improvements</p>
                                    <ul className="space-y-1">
                                        {a.recommendations.slice(0, 3).map((s, j) => (
                                            <li key={j} className="text-xs text-[#1C1C1A] flex gap-1.5">
                                                <span className="text-[#C8922E] font-bold">→</span> {s}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Aggregate Takeaways */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {allStrengths.length > 0 && (
                    <div className="editorial-card p-5 rounded-md">
                        <p className="eyebrow mb-3" style={{ color: "#2F6B57" }}>Top Strengths Across Session</p>
                        <ul className="space-y-1.5">
                            {allStrengths.map((s, i) => (
                                <li key={i} className="text-sm text-[#1C1C1A] flex gap-2">
                                    <span className="text-[#2F6B57] font-bold">✓</span> {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {allRecs.length > 0 && (
                    <div className="editorial-card p-5 rounded-md">
                        <p className="eyebrow mb-3" style={{ color: "#C8922E" }}>Priority Coaching Recommendations</p>
                        <ul className="space-y-1.5">
                            {allRecs.map((s, i) => (
                                <li key={i} className="text-sm text-[#1C1C1A] flex gap-2">
                                    <span className="text-[#C8922E] font-bold">→</span> {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* Methodology & Scoring Explanation */}
            <div className="editorial-card p-5 rounded-md bg-[#FAF7F0] border border-[#E5E0D5]">
                <p className="eyebrow mb-2">Scoring &amp; Calculation Methodology</p>
                <p className="text-xs text-[#68665F] leading-relaxed">
                    Overall session score is computed as the arithmetic mean of evaluated answers. Each answer score strictly reflects:
                    <strong className="text-[#1C1C1A]"> 35% Relevance</strong> (answering the prompt directly),
                    <strong className="text-[#1C1C1A]"> 30% Clarity</strong> (coherent structure, minimal rambling), and
                    <strong className="text-[#1C1C1A]"> 35% Technical / STAR Correctness</strong> (concrete actions and quantifiable outcomes).
                    All video framing and speech metrics are derived deterministically from hardware sensors and local computer vision pipelines.
                </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                    type="button"
                    onClick={onRestart}
                    className="btn-primary px-6 py-3 font-semibold rounded-md text-sm shadow-sm"
                >
                    Start a New Session →
                </button>
                <button
                    type="button"
                    onClick={handleCopyReport}
                    className="px-6 py-3 font-semibold rounded-md text-sm border border-[#2F6B57] text-[#174A3A] hover:bg-[#E8F2EE] transition-colors"
                >
                    {copied ? "✓ Copied to Clipboard" : "📋 Copy Session Transcript & Report"}
                </button>
            </div>
        </div>
    );
}

function MiniScore({ label, value }) {
    return (
        <div>
            <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-[#68665F] font-medium">{label}</span>
                <span className="text-[#1C1C1A] font-bold">{Math.round(value || 0)}</span>
            </div>
            <ScoreBar value={value || 0} color="#2F6B57" />
        </div>
    );
}