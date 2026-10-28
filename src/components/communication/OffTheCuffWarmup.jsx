import React, { useState, useEffect, useRef, useCallback } from "react";
import { PROMPT_CATEGORIES, getRandomPrompt } from "@/data/promptDecks";
import { awardCoins, setScores } from "@/lib/careerState";

const COUNTDOWN_SECONDS = 5;
const DEFAULT_DURATION = 60;
const DURATION_OPTIONS = [30, 60, 90];

export default function OffTheCuffWarmup({ state, refresh, onSwitchToStructured }) {
    const [status, setStatus] = useState("idle"); // 'idle' | 'prompt_ready' | 'countdown' | 'speaking' | 'completed' | 'stopped'
    const [selectedCategory, setSelectedCategory] = useState("behavioral");
    const [duration, setDuration] = useState(DEFAULT_DURATION);
    const [currentPrompt, setCurrentPrompt] = useState(null);
    const [seenPromptIds, setSeenPromptIds] = useState([]);
    const [countdownVal, setCountdownVal] = useState(COUNTDOWN_SECONDS);
    const [secondsRemaining, setSecondsRemaining] = useState(DEFAULT_DURATION);
    const [rewarded, setRewarded] = useState(false);
    const [earnedCoins, setEarnedCoins] = useState(0);

    const timerRef = useRef(null);
    const countdownTimerRef = useRef(null);
    const hasAwardedRef = useRef(false);

    // Pick initial prompt when category changes or on mount
    const selectNewPrompt = useCallback((catId, forceNew = false) => {
        const cat = catId || selectedCategory;
        const next = getRandomPrompt(cat, seenPromptIds);
        setCurrentPrompt(next);
        if (next) {
            setSeenPromptIds((prev) => [...prev.slice(-15), next.id]);
        }
        if (forceNew || status === "idle") {
            setStatus("prompt_ready");
        }
    }, [selectedCategory, seenPromptIds, status]);

    // Handle category dropdown change
    function handleCategoryChange(e) {
        const newCat = e.target.value;
        setSelectedCategory(newCat);
        selectNewPrompt(newCat, true);
    }

    // Clean up all active timers
    function clearAllTimers() {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        if (countdownTimerRef.current) {
            clearInterval(countdownTimerRef.current);
            countdownTimerRef.current = null;
        }
    }

    useEffect(() => {
        // Initialize with a prompt ready on mount
        selectNewPrompt("behavioral", true);
        return () => clearAllTimers();
    }, []);

    // ── Start 5-second countdown phase ──
    const startCountdown = useCallback(() => {
        clearAllTimers();
        setStatus("countdown");
        setCountdownVal(COUNTDOWN_SECONDS);
        setRewarded(false);
        hasAwardedRef.current = false;

        let count = COUNTDOWN_SECONDS;
        countdownTimerRef.current = setInterval(() => {
            count -= 1;
            if (count > 0) {
                setCountdownVal(count);
            } else {
                clearInterval(countdownTimerRef.current);
                countdownTimerRef.current = null;
                startSpeakingTimer();
            }
        }, 1000);
    }, [duration]);

    // ── Start 60-second speaking timer ──
    function startSpeakingTimer() {
        setStatus("speaking");
        setSecondsRemaining(duration);

        let rem = duration;
        timerRef.current = setInterval(() => {
            rem -= 1;
            setSecondsRemaining(rem);

            if (rem <= 0) {
                clearInterval(timerRef.current);
                timerRef.current = null;
                handleComplete();
            }
        }, 1000);
    }

    // ── Stop active drill ──
    const stopDrill = useCallback(() => {
        clearAllTimers();
        setStatus("stopped");
    }, []);

    // ── Completion & Reward Integration ──
    const handleComplete = useCallback(async () => {
        clearAllTimers();
        setStatus("completed");

        if (hasAwardedRef.current) return;
        hasAwardedRef.current = true;

        if (state) {
            try {
                // Award 15 Coins and 25 XP for completing off-the-cuff warm-up
                const fresh = await awardCoins(state, {
                    amount: 15,
                    xp: 25,
                    transaction_type: "REWARD_CLAIM",
                    description: "Off-the-Cuff Speaking Warm-up",
                    reference_id: `warmup_${Date.now().toString(36)}`
                });
                setEarnedCoins(15);
                setRewarded(true);

                // Blend communication progression (+2 readiness boost up to 95)
                const currentScore = state.communication_score || 65;
                const nextScore = Math.min(95, currentScore + 2);
                await setScores(fresh, { communication_score: nextScore });

                if (refresh) await refresh();
            } catch (err) {
                // Non-critical fallback
                setRewarded(true);
            }
        } else {
            setRewarded(true);
            setEarnedCoins(15);
        }
    }, [state, refresh]);

    // ── Keyboard Shortcuts (Spacebar: Start/Draw, R: Shuffle, Esc: Stop) ──
    useEffect(() => {
        function handleKeyDown(e) {
            // Ignore when typing inside input/textarea/select
            const tag = e.target.tagName?.toLowerCase();
            if (tag === "input" || tag === "textarea" || tag === "select" || e.target.isContentEditable) {
                return;
            }

            if (e.code === "Space") {
                e.preventDefault();
                if (status === "prompt_ready" || status === "idle" || status === "stopped") {
                    startCountdown();
                } else if (status === "completed") {
                    selectNewPrompt(selectedCategory, true);
                    startCountdown();
                }
            } else if (e.key === "r" || e.key === "R") {
                if (status === "prompt_ready" || status === "idle" || status === "stopped" || status === "completed") {
                    e.preventDefault();
                    selectNewPrompt(selectedCategory, true);
                }
            } else if (e.code === "Escape") {
                if (status === "countdown" || status === "speaking") {
                    e.preventDefault();
                    stopDrill();
                }
            }
        }

        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [status, selectedCategory, startCountdown, selectNewPrompt, stopDrill]);

    // Format mm:ss
    const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

    // Timer phase calculations for 3 visual stages
    const progressPercent = ((duration - secondsRemaining) / duration) * 100;
    const isPhase1 = secondsRemaining > duration * 0.5; // 60–30s
    const isPhase2 = secondsRemaining <= duration * 0.5 && secondsRemaining > 10; // 30–10s
    const isPhase3 = secondsRemaining <= 10; // 10–0s

    const currentPhaseLabel = isPhase1
        ? "Opening & Framing"
        : isPhase2
        ? "Core Example & Reasoning"
        : "Conclusion & Landing Point";

    const currentPhaseColor = isPhase1 ? "#174A3A" : isPhase2 ? "#C8922E" : "#A44732";

    // Circular SVG progress dial parameters
    const dialRadius = 84;
    const dialCircumference = 2 * Math.PI * dialRadius;
    const dialOffset = dialCircumference - (progressPercent / 100) * dialCircumference;

    return (
        <div className="space-y-6">
            {/* Landing / Configuration Bar */}
            <div className="editorial-panel p-6 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#C8922E] animate-pulse" />
                        <p className="eyebrow text-[#174A3A]">Spontaneous Speaking Gym</p>
                    </div>
                    <h2 className="text-xl font-bold text-[#1C1C1A]">Off-the-Cuff Warm-up</h2>
                    <p className="text-xs text-[#68665F] mt-0.5">
                        Practise thinking and speaking out loud under time pressure — zero judgment, zero scoring.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Prompt Deck Selector */}
                    <div>
                        <label className="block text-[11px] font-semibold text-[#68665F] mb-1">Prompt Deck</label>
                        <select
                            value={selectedCategory}
                            onChange={handleCategoryChange}
                            disabled={status === "countdown" || status === "speaking"}
                            className="px-3 py-1.5 rounded-md border border-[#D9D3C7] bg-white text-xs font-semibold text-[#1C1C1A] hover:border-[#174A3A] focus:outline-none focus:ring-1 focus:ring-[#174A3A] disabled:opacity-50"
                        >
                            {PROMPT_CATEGORIES.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.icon} {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Duration Selector */}
                    <div>
                        <label className="block text-[11px] font-semibold text-[#68665F] mb-1">Duration</label>
                        <div className="flex rounded-md border border-[#D9D3C7] overflow-hidden bg-white">
                            {DURATION_OPTIONS.map((d) => (
                                <button
                                    key={d}
                                    type="button"
                                    onClick={() => {
                                        setDuration(d);
                                        setSecondsRemaining(d);
                                    }}
                                    disabled={status === "countdown" || status === "speaking"}
                                    className={`px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                                        duration === d
                                            ? "bg-[#174A3A] text-white"
                                            : "text-[#68665F] hover:text-[#1C1C1A] hover:bg-[#FAF7F0]"
                                    } disabled:opacity-50`}
                                >
                                    {d}s
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Interactive Stage */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Center Drill Card (2 columns) */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Prompt Card */}
                    <div className="editorial-panel p-8 sm:p-10 rounded-lg text-center relative border-2 border-[#E5E0D5]">
                        <div className="flex items-center justify-between mb-4">
                            <span className="badge-forest px-2.5 py-1 rounded-full text-xs font-semibold">
                                {PROMPT_CATEGORIES.find((c) => c.id === selectedCategory)?.name || "Prompt"}
                            </span>
                            <button
                                type="button"
                                onClick={() => selectNewPrompt(selectedCategory, true)}
                                disabled={status === "countdown" || status === "speaking"}
                                className="text-xs font-semibold text-[#174A3A] hover:underline flex items-center gap-1 disabled:opacity-40"
                                title="Shuffle prompt (Shortcut: R)"
                            >
                                <span>Shuffle Prompt ↻</span>
                                <span className="text-[10px] text-[#68665F] hidden sm:inline">(R)</span>
                            </button>
                        </div>

                        {/* Large Prompt Question */}
                        <div className="py-6 min-h-36 flex items-center justify-center">
                            <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1C1C1A] leading-snug max-w-2xl mx-auto">
                                &ldquo;{currentPrompt?.question || "Loading next spontaneous prompt..."}&rdquo;
                            </h3>
                        </div>

                        {/* Status / Active Flow Rendering */}
                        <div className="pt-6 border-t border-[#E5E0D5]">
                            {/* State: Prompt Ready / Idle */}
                            {(status === "idle" || status === "prompt_ready" || status === "stopped") && (
                                <div className="flex flex-col items-center justify-center gap-3">
                                    <button
                                        type="button"
                                        onClick={startCountdown}
                                        className="btn-primary px-8 py-4 text-base font-bold rounded-lg shadow-md hover:scale-[1.02] transition-all flex items-center gap-2"
                                    >
                                        <span>⚡ Start 5s Prep &amp; Speak</span>
                                        <span className="text-xs opacity-75 font-normal hidden sm:inline">(Spacebar)</span>
                                    </button>
                                    <p className="text-xs text-[#68665F]">
                                        Take 5 seconds to structure your thoughts, then speak for {duration} seconds.
                                    </p>
                                </div>
                            )}

                            {/* State: 5-Second Countdown */}
                            {status === "countdown" && (
                                <div className="flex flex-col items-center justify-center py-4 animate-in fade-in zoom-in-90 duration-200">
                                    <p className="eyebrow text-[#A44732] mb-2 font-bold tracking-wider uppercase">
                                        Take a breath &amp; prepare…
                                    </p>
                                    <div className="w-24 h-24 rounded-full bg-[#FAF7F0] border-4 border-[#C8922E] flex items-center justify-center text-5xl font-black text-[#174A3A] shadow-inner animate-pulse">
                                        {countdownVal}
                                    </div>
                                    <p className="text-sm font-semibold text-[#1C1C1A] mt-3">
                                        Speaking starts in {countdownVal}s
                                    </p>
                                </div>
                            )}

                            {/* State: Active Speaking Timer */}
                            {status === "speaking" && (
                                <div className="flex flex-col items-center justify-center py-2 animate-in fade-in duration-150">
                                    {/* Circular Timer Graphic */}
                                    <div className="relative w-48 h-48 flex items-center justify-center">
                                        <svg className="w-full h-full -rotate-90" viewBox="0 0 190 190">
                                            {/* Background track */}
                                            <circle
                                                cx="95"
                                                cy="95"
                                                r={dialRadius}
                                                stroke="#FAF7F0"
                                                strokeWidth="10"
                                                fill="transparent"
                                            />
                                            {/* Animated Progress Ring */}
                                            <circle
                                                cx="95"
                                                cy="95"
                                                r={dialRadius}
                                                stroke={currentPhaseColor}
                                                strokeWidth="10"
                                                strokeDasharray={dialCircumference}
                                                strokeDashoffset={dialOffset}
                                                strokeLinecap="round"
                                                fill="transparent"
                                                style={{ transition: "stroke-dashoffset 1s linear, stroke 0.5s ease" }}
                                            />
                                        </svg>

                                        {/* Center Time Display */}
                                        <div className="absolute flex flex-col items-center justify-center text-center">
                                            <span className="text-4xl font-black text-[#1C1C1A] tabular-nums tracking-tight">
                                                {fmt(secondsRemaining)}
                                            </span>
                                            <span
                                                className="text-[11px] font-bold uppercase tracking-wider mt-1 px-2 py-0.5 rounded-full"
                                                style={{ color: currentPhaseColor, backgroundColor: `${currentPhaseColor}15` }}
                                            >
                                                {currentPhaseLabel}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stop Action */}
                                    <div className="mt-5 flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={stopDrill}
                                            className="px-6 py-2.5 rounded-md text-xs font-bold border border-[#D9D3C7] text-[#68665F] hover:text-[#A44732] hover:bg-[#FDF2F0] hover:border-[#F4D0C8] transition-all flex items-center gap-1.5"
                                        >
                                            <span>⏹ Stop Drill</span>
                                            <span className="text-[10px] text-[#68665F] hidden sm:inline">(Esc)</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* State: Completed Loop */}
                            {status === "completed" && (
                                <div className="py-4 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                                    <div className="p-4 rounded-lg bg-[#E8F2EE] border border-[#B8DACD] text-center max-w-md mx-auto">
                                        <p className="text-2xl mb-1">🎉</p>
                                        <p className="text-lg font-bold text-[#174A3A]">Warm-up Complete!</p>
                                        <p className="text-xs text-[#2F6B57] mt-0.5">
                                            {duration} seconds completed · Great flow and mental agility.
                                        </p>
                                        {rewarded && (
                                            <div className="flex items-center justify-center gap-2 mt-3 text-xs font-bold text-[#174A3A]">
                                                <span className="badge-coin px-2.5 py-1 rounded-full">+15 Coins</span>
                                                <span className="badge-forest px-2.5 py-1 rounded-full">+25 XP</span>
                                                <span className="text-[#A44732] font-semibold">🔥 Streak Protected</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                selectNewPrompt(selectedCategory, true);
                                                startCountdown();
                                            }}
                                            className="btn-primary px-6 py-3 font-semibold rounded-md text-sm shadow-sm"
                                        >
                                            Try Another Prompt →
                                        </button>
                                        <button
                                            type="button"
                                            onClick={onSwitchToStructured}
                                            className="px-6 py-3 font-semibold rounded-md text-sm border border-[#2F6B57] text-[#174A3A] hover:bg-[#E8F2EE] transition-colors"
                                        >
                                            Try Speech Analysis Mode 🎙️
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Sidebar: Rules & Framework */}
                <div className="space-y-6">
                    {/* The 3-Phase Speaking Framework */}
                    <div className="editorial-card p-6 rounded-md">
                        <p className="eyebrow mb-3">60s Delivery Framework</p>
                        <ul className="space-y-3.5 text-xs text-[#1C1C1A]">
                            <li className="flex items-start gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-[#E8F2EE] text-[#174A3A] flex items-center justify-center font-bold shrink-0 mt-0.5">
                                    1
                                </span>
                                <div>
                                    <p className="font-bold text-[#174A3A]">60s – 30s: Opening &amp; Framing</p>
                                    <p className="text-[#68665F] mt-0.5 leading-relaxed">
                                        State your core thesis directly. Avoid warming up with empty filler words.
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-[#FAF7F0] border border-[#E5E0D5] text-[#C8922E] flex items-center justify-center font-bold shrink-0 mt-0.5">
                                    2
                                </span>
                                <div>
                                    <p className="font-bold text-[#C8922E]">30s – 10s: Example &amp; Action</p>
                                    <p className="text-[#68665F] mt-0.5 leading-relaxed">
                                        Provide a concrete scenario or technical trade-off illustrating your point.
                                    </p>
                                </div>
                            </li>
                            <li className="flex items-start gap-2.5">
                                <span className="w-5 h-5 rounded-full bg-[#FDF2F0] text-[#A44732] flex items-center justify-center font-bold shrink-0 mt-0.5">
                                    3
                                </span>
                                <div>
                                    <p className="font-bold text-[#A44732]">10s – 0s: Landing Point</p>
                                    <p className="text-[#68665F] mt-0.5 leading-relaxed">
                                        Summarize key takeaway and conclude with confidence.
                                    </p>
                                </div>
                            </li>
                        </ul>
                    </div>

                    {/* Keyboard Shortcuts Guide */}
                    <div className="editorial-card p-5 rounded-md">
                        <p className="eyebrow mb-2">Keyboard Controls</p>
                        <div className="space-y-1.5 text-xs">
                            <div className="flex items-center justify-between text-[#68665F]">
                                <span>Start / Draw prompt</span>
                                <kbd className="px-2 py-0.5 rounded bg-[#FAF7F0] border border-[#D9D3C7] text-[#1C1C1A] font-mono text-[10px] font-semibold">
                                    Spacebar
                                </kbd>
                            </div>
                            <div className="flex items-center justify-between text-[#68665F]">
                                <span>Shuffle prompt</span>
                                <kbd className="px-2 py-0.5 rounded bg-[#FAF7F0] border border-[#D9D3C7] text-[#1C1C1A] font-mono text-[10px] font-semibold">
                                    R
                                </kbd>
                            </div>
                            <div className="flex items-center justify-between text-[#68665F]">
                                <span>Stop active drill</span>
                                <kbd className="px-2 py-0.5 rounded bg-[#FAF7F0] border border-[#D9D3C7] text-[#1C1C1A] font-mono text-[10px] font-semibold">
                                    Esc
                                </kbd>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
