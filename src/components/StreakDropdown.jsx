import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

const WEEK_DAYS = [
    { short: "M", full: "MON", label: "Monday" },
    { short: "T", full: "TUE", label: "Tuesday" },
    { short: "W", full: "WED", label: "Wednesday" },
    { short: "T", full: "THU", label: "Thursday" },
    { short: "F", full: "FRI", label: "Friday" },
    { short: "S", full: "SAT", label: "Saturday" },
    { short: "S", full: "SUN", label: "Sunday" }
];

const MILESTONES = [
    { days: 3, label: "3d Ember", icon: "🪵", color: "#C05F4A" },
    { days: 7, label: "7d Flame (+50🪙)", icon: "🔥", color: "#C8922E" },
    { days: 14, label: "14d Blaze", icon: "⚡", color: "#2F6B57" },
    { days: 30, label: "30d Diamond", icon: "💎", color: "#3B82F6" }
];

export default function StreakDropdown({ streak = 0, longestStreak = 0, activeDays = [], isDemo = false }) {
    const [open, setOpen] = useState(false);
    const [showExplainer, setShowExplainer] = useState(false);
    const containerRef = useRef(null);

    // Get current day of week (0 = Sun, 1 = Mon, ..., 6 = Sat)
    const todayIndex = (new Date().getDay() + 6) % 7; // Map Sun=0 to 6, Mon=1 to 0
    const todayFull = WEEK_DAYS[todayIndex]?.full;

    const activeSet = new Set(activeDays || []);
    const targetDays = 7;
    const progressPct = Math.min(100, Math.round((streak / targetDays) * 100));

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [open]);

    return (
        <div ref={containerRef} className="relative inline-flex items-center">
            {/* Clickable streak badge trigger */}
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer select-none ${
                    streak > 0
                        ? "bg-[#FDF2F0] text-[#A44732] border border-[#F4D0C8] hover:bg-[#FCE8E4] hover:shadow-sm"
                        : "bg-[#FAF7F0] text-[#68665F] border border-[#E5E0D5] hover:bg-[#F2ECE1]"
                }`}
                aria-label={`Daily streak: ${streak} days. Click for streak details.`}
                aria-expanded={open}
            >
                <span>🔥</span>
                <span>{streak}</span>
            </button>

            {/* Dropdown Popover */}
            {open && (
                <div
                    className="absolute right-0 top-full mt-2.5 z-50 w-80 sm:w-88 p-5 bg-[#1C1C1A] text-white rounded-xl shadow-2xl border border-white/10 animate-in fade-in zoom-in-95 duration-150"
                    role="dialog"
                    aria-label="Practice Streak Details"
                >
                    {/* Glowing Campfire Graphic */}
                    <div className="flex flex-col items-center justify-center text-center pt-1 pb-3">
                        <div className="relative mb-2">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-t from-[#A44732]/30 via-[#C8922E]/20 to-transparent flex items-center justify-center text-4xl animate-pulse">
                                🔥
                            </div>
                            <div className="text-sm absolute -bottom-1 left-1/2 -translate-x-1/2">
                                🪵
                            </div>
                        </div>

                        <p className="text-2xl font-extrabold tracking-tight mt-1">
                            {streak} / {targetDays} days
                        </p>

                        {/* Progress bar to 7-day milestone */}
                        <div className="w-48 h-1.5 bg-white/15 rounded-full mt-2 overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#C8922E] to-[#A44732] rounded-full transition-all duration-300"
                                style={{ width: `${Math.max(8, progressPct)}%` }}
                            />
                        </div>

                        <p className="text-xs text-white/70 mt-2.5 max-w-xs leading-relaxed">
                            {streak === 0
                                ? "Start your practice streak today. Ignite your preparation flame!"
                                : streak >= 7
                                ? "Milestone achieved! Keep your momentum going strong."
                                : "Keep the momentum going! Practise daily to protect your flame."}
                        </p>

                        {/* Milestone Badges */}
                        <div className="flex items-center justify-center gap-2.5 mt-4">
                            {MILESTONES.map((m) => {
                                const unlocked = streak >= m.days || longestStreak >= m.days;
                                return (
                                    <div
                                        key={m.days}
                                        className={`flex flex-col items-center gap-1 p-2 rounded-lg text-center transition-all ${
                                            unlocked
                                                ? "bg-white/10 border border-white/20 shadow-sm"
                                                : "bg-white/5 opacity-40 border border-transparent"
                                        }`}
                                        title={`${m.label}: ${unlocked ? "Unlocked!" : `${m.days} day goal`}`}
                                    >
                                        <span className="text-base leading-none">{m.icon}</span>
                                        <span className="text-[10px] font-bold text-white/90">{m.days}d</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Weekly Streak Calendar Strip */}
                    <div className="bg-white/5 rounded-lg p-3 mt-2 border border-white/10">
                        <div className="grid grid-cols-7 gap-1 text-center">
                            {WEEK_DAYS.map((day, idx) => {
                                const isToday = day.full === todayFull || idx === todayIndex;
                                const isActive = activeSet.has(day.full) || (isDemo && idx < streak);

                                return (
                                    <div key={day.full} className="flex flex-col items-center gap-1">
                                        <span className="text-[10px] font-semibold text-white/50">
                                            {day.short}
                                        </span>
                                        <div
                                            className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all relative ${
                                                isActive
                                                    ? "bg-[#A44732] text-white shadow-md shadow-[#A44732]/40"
                                                    : isToday
                                                    ? "border-2 border-[#C8922E] text-[#C8922E] bg-white/5"
                                                    : "bg-white/5 text-white/30"
                                            }`}
                                        >
                                            {isActive ? "🔥" : isToday ? "●" : "○"}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Explainer Accordion Toggle */}
                    <div className="mt-4 pt-3 border-t border-white/10 text-center">
                        <button
                            type="button"
                            onClick={() => setShowExplainer((prev) => !prev)}
                            className="text-xs font-semibold text-[#B8DACD] hover:text-white transition-colors"
                        >
                            {showExplainer ? "Hide streak rules ▲" : "What is a streak flame? ▼"}
                        </button>

                        {showExplainer && (
                            <div className="mt-2.5 p-3 rounded-lg bg-white/5 text-left text-xs text-white/70 space-y-1.5 leading-relaxed animate-in fade-in duration-100">
                                <p>• Complete any training session daily (Resume scan, 60s speech, or Mock interview).</p>
                                <p>• 7 consecutive days unlocks a <strong className="text-[#C8922E]">+50 Coin bonus</strong>.</p>
                                <p>• Missing a day resets the active flame to 0.</p>
                            </div>
                        )}

                        <div className="mt-3">
                            <Link
                                to="/communication?mode=warmup"
                                onClick={() => setOpen(false)}
                                className="block w-full py-2 px-3 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white text-center transition-colors"
                            >
                                Start 60s Vocal Warm-up →
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
