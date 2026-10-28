import React, { useEffect, useRef, useState } from "react";
import { usePageState } from "@/lib/usePageState";
import { base44 } from "@/api/base44Client";
import { awardCoins, setScores } from "@/lib/careerState";
import { FILLER_WORDS, TOPICS } from "@/lib/careerData";
import PageHeader from "@/components/ui/PageHeader";
import ErrorBanner from "@/components/ui/ErrorBanner";
import MetricCard from "@/components/ui/MetricCard";
import Spinner from "@/components/ui/Spinner";

export default function Communication() {
    const { state, refresh } = usePageState();

    // ── Structured Speech Analysis State & Handlers ──
    const [topic, setTopic] = useState(TOPICS[0]);
    const [recording, setRecording] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);
    const [rewarded, setRewarded] = useState(false);
    const mediaRef = useRef(null);
    const chunksRef = useRef([]);
    const timerRef = useRef(null);
    const recorderRef = useRef(null);
    const lastBlobRef = useRef(null);
    const lastDurationRef = useRef(0);

    useEffect(() => () => {
        stopTimer();
        if (mediaRef.current) mediaRef.current.getTracks().forEach((t) => t.stop());
    }, []);

    function stopTimer() {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }

    async function startRecording() {
        setError("");
        setResult(null);
        setRewarded(false);
        setSeconds(0);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRef.current = stream;
            const recorder = new MediaRecorder(stream);
            chunksRef.current = [];
            recorder.ondataavailable = (e) => chunksRef.current.push(e.data);
            recorder.start();
            recorderRef.current = recorder;
            setRecording(true);
            timerRef.current = setInterval(() => setSeconds((s) => s + 1), 1000);
        } catch (e) {
            setError("Microphone access unavailable or denied. Check browser mic permissions and try again.");
        }
    }

    async function stopRecording() {
        stopTimer();
        const recorder = recorderRef.current;
        const duration = seconds;
        setRecording(false);
        if (recorder && recorder.state !== "inactive") {
            recorder.onstop = async () => {
                const mimeType = recorder.mimeType || chunksRef.current.find((chunk) => chunk.type)?.type || "audio/webm";
                const blob = new Blob(chunksRef.current, { type: mimeType });
                if (mediaRef.current) {
                    mediaRef.current.getTracks().forEach((t) => t.stop());
                }
                if (duration < 2 || blob.size < 1000) {
                    setError("Please record at least 2 seconds of speech before stopping.");
                    lastBlobRef.current = null;
                    lastDurationRef.current = 0;
                    return;
                }
                lastBlobRef.current = blob;
                lastDurationRef.current = duration;
                await analyze(blob, duration);
            };
            recorder.stop();
        } else {
            setError("No active recording was found. Please start a new recording.");
        }
    }

    async function analyze(blob, duration) {
        setAnalyzing(true);
        setError("");
        try {
            const file = new File([blob], "answer.webm", { type: "audio/webm" });
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            const res = await base44.functions.invoke("analyzeSpeech", {
                audio_url: file_url,
                duration_seconds: duration
            });
            const data = res?.data ?? res;
            if (data?.error) {
                setError(data.error);
                setAnalyzing(false);
                return;
            }
            const saved = await base44.entities.SpeechSession.create({
                transcript: data.transcript,
                word_count: data.word_count,
                duration_seconds: data.duration_seconds,
                wpm: data.wpm,
                filler_count: data.filler_count,
                filler_rate: data.filler_rate,
                filler_words_found: data.filler_words_found,
                score: data.score,
                topic
            });
            setError("");
            setResult(saved);

            if (state) {
                try {
                    const newComm = Math.round((state.communication_score || 65) * 0.6 + data.score * 0.4);
                    const next = await setScores(state, { communication_score: newComm });
                    const fresh = await awardCoins(next, {
                        amount: 15,
                        xp: 25,
                        transaction_type: "REWARD_CLAIM",
                        description: "60s Communication Challenge",
                        reference_id: `speech_${saved.id}`
                    });
                    if (fresh.coin_balance !== next.coin_balance) setRewarded(true);
                    await refresh();
                } catch {
                    // Non-critical
                }
            }
        } catch (e) {
            setError(e?.message || "Something went wrong analyzing your speech — please try again.");
        } finally {
            setAnalyzing(false);
        }
    }

    function randomize() {
        const next = TOPICS[Math.floor(Math.random() * TOPICS.length)];
        setTopic(next);
    }

    const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

    return (
        <div>
            <PageHeader
                eyebrow="Communication Practice Coach"
                title="Structured Speech Analysis"
                subtitle="Run deep speech-to-text analysis with pace (WPM), filler detection, and actionable delivery coaching."
            />

            {/* Preserved Structured Speech Analysis Studio */}
            <div>
                {rewarded && (
                    <div className="mb-6 p-3 rounded-md bg-[#E8F2EE] border border-[#B8DACD] text-[#174A3A] text-sm font-semibold">
                        🎉 Reward claimed: +15 Coins, +25 XP
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Recording studio */}
                    <div className="lg:col-span-2">
                        <div className="editorial-panel p-8 rounded-lg">
                            <div className="mb-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="eyebrow">Random Topic</p>
                                    <button onClick={randomize} className="text-xs font-semibold text-[#174A3A] hover:underline">
                                        Shuffle ↻
                                    </button>
                                </div>
                                <p className="text-lg font-semibold text-[#1C1C1A] leading-snug">{topic}</p>
                            </div>

                            <div className="flex flex-col items-center justify-center py-10">
                                <button
                                    onClick={recording ? stopRecording : startRecording}
                                    disabled={analyzing}
                                    className={`w-24 h-24 rounded-full flex items-center justify-center text-3xl transition-all shadow-md ${recording
                                            ? "bg-[#A44732] text-white animate-pulse"
                                            : "bg-[#174A3A] text-white hover:bg-[#123B2E] disabled:opacity-50"
                                        }`}
                                >
                                    {recording ? "⏹" : "🎙"}
                                </button>
                                <p className="mt-4 text-sm font-semibold text-[#1C1C1A]">
                                    {analyzing ? "Analysing speech…" : recording ? "Recording — click to stop" : "Click to start recording"}
                                </p>
                                {(recording || seconds > 0) && (
                                    <p className="mt-1 text-2xl font-bold tabular-nums" style={{ color: recording ? "#A44732" : "#1C1C1A" }}>
                                        {fmt(seconds)}
                                    </p>
                                )}
                                {analyzing && (
                                    <div className="mt-4 flex items-center gap-2 text-[#174A3A] text-sm font-semibold">
                                        <Spinner /> Transcribing & scoring with AI…
                                    </div>
                                )}
                            </div>

                            {error && (
                                <div className="mt-4">
                                    <ErrorBanner
                                        message={error}
                                        onRetry={lastBlobRef.current ? () => analyze(lastBlobRef.current, lastDurationRef.current) : startRecording}
                                    />
                                </div>
                            )}
                        </div>

                        {result && (
                            <div className="editorial-panel p-7 rounded-lg mt-6">
                                <p className="eyebrow mb-4">Transcript</p>
                                <div className="p-4 rounded-md bg-[#FAF7F0] border border-[#E5E0D5] text-sm text-[#1C1C1A] leading-relaxed max-h-64 overflow-y-auto">
                                    {result.transcript}
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-5">
                                    <MetricCard label="WPM" value={result.wpm} hint="target 120-160" />
                                    <MetricCard label="Word Count" value={result.word_count} />
                                    <MetricCard label="Fillers" value={result.filler_count} hint={`found: ${result.filler_words_found?.join(", ") || "none"}`} />
                                    <MetricCard label="Filler Rate" value={`${result.filler_rate}%`} hint="target < 3.0%" />
                                </div>

                                <div className="mt-6 p-5 rounded-md bg-[#E8F2EE] border border-[#B8DACD]">
                                    <div className="flex items-baseline justify-between">
                                        <p className="eyebrow text-[#174A3A]">Overall Speech Score</p>
                                        <span className="text-3xl font-bold text-[#174A3A]">{result.score}<span className="text-sm text-[#68665F]">/100</span></span>
                                    </div>
                                </div>

                                {result.feedback && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-5">
                                        <FeedbackList title="Strengths" items={result.feedback?.strengths || []} color="#2F6B57" mark="✓" />
                                        <FeedbackList title="Recommendations" items={result.feedback?.recommendations || []} color="#C8922E" mark="→" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Target specs */}
                    <div>
                        <div className="editorial-card p-6 rounded-md">
                            <p className="eyebrow mb-4">Target Specs</p>
                            <div className="space-y-4 text-sm">
                                <div>
                                    <p className="font-semibold text-[#1C1C1A]">Speaking Pace</p>
                                    <p className="text-[#68665F]">120–160 words per minute</p>
                                </div>
                                <div className="pt-4 border-t border-[#E5E0D5]">
                                    <p className="font-semibold text-[#1C1C1A]">Filler Rate</p>
                                    <p className="text-[#68665F]">Below 3.0%</p>
                                </div>
                                <div className="pt-4 border-t border-[#E5E0D5]">
                                    <p className="font-semibold text-[#1C1C1A] mb-2">Tracked Fillers</p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {FILLER_WORDS.map((w) => (
                                            <span key={w} className="badge-coin px-2 py-0.5 rounded-full text-xs">{w}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="editorial-card p-6 rounded-md mt-6">
                            <p className="eyebrow mb-3">How Scoring Works</p>
                            <p className="text-sm text-[#68665F] leading-relaxed">
                                Score = 50% pace + 50% filler rate. Transcription runs on speech-to-text; WPM and filler counts are
                                computed deterministically from the transcript.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function FeedbackList({ title, items, color, mark }) {
    return (
        <div className="editorial-card p-5 rounded-md">
            <p className="eyebrow mb-3" style={{ color }}>{title}</p>
            {items?.length ? (
                <ul className="space-y-1.5">
                    {items.map((s, i) => (
                        <li key={i} className="text-sm text-[#1C1C1A] flex gap-2">
                            <span style={{ color }}>{mark}</span>
                            <span>{s}</span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-xs text-[#68665F]">None flagged.</p>
            )}
        </div>
    );
}