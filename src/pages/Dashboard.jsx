import React from "react";
import { Link } from "react-router-dom";
import { usePageState } from "@/lib/usePageState";
import { levelFor, readinessScore, topWeaknesses, WEEK_DAYS } from "@/lib/careerData";
import ScoreBar from "@/components/ui/ScoreBar";
import ScoreCard from "@/components/ui/ScoreCard";
import PageHeader from "@/components/ui/PageHeader";
import ReadinessScoreTooltip from "@/components/ReadinessScoreTooltip";

export default function Dashboard() {
    const { state } = usePageState();
    if (!state) return <div className="text-[#68665F] text-sm">Loading your studio…</div>;

    const level = levelFor(state.xp);
    const readiness = readinessScore(state);
    const weaknesses = topWeaknesses(state);
    const active = new Set(state.active_days || []);

    return (
        <div>
            <PageHeader
                eyebrow="Career Progression Studio"
                title="Career Progression Studio"
                subtitle="Your single readiness score, level progression, wallet and daily mission — all in one place."
            >
                <span className="badge-forest px-3 py-1.5 rounded-full text-xs font-semibold">
                    {state.target_role}
                </span>
            </PageHeader>

            {/* Level progression banner */}
            <div className="editorial-panel p-7 rounded-lg mb-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                    <div>
                        <p className="eyebrow mb-1">Level Progression</p>
                        <p className="text-xl font-bold text-[#1C1C1A]">
                            Level {level.level} · {level.title}
                        </p>
                        <p className="text-xs text-[#68665F] mt-1">
                            {state.xp} XP total{level.next ? ` · ${level.next.xp - state.xp} XP to ${level.next.title}` : " · Max level reached"}
                        </p>
                    </div>
                    <div className="text-sm text-[#68665F]">{level.progress}% to next level</div>
                </div>
                <ScoreBar value={level.progress} />
                <div className="flex items-center justify-between mt-4 px-1">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                        <div key={n} className="flex flex-col items-center gap-1.5">
                            <div
                                className={`w-2.5 h-2.5 rounded-full ${n <= level.level ? "bg-[#174A3A]" : "bg-[#D9D3C7]"
                                    }`}
                            />
                            <span className="text-[10px] text-[#68665F] font-medium">L{n}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Three-column row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                {/* Coin wallet */}
                <div className="editorial-panel p-6 rounded-lg">
                    <p className="eyebrow mb-3">Career Coin Wallet</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-[#1C1C1A]">🪙 {state.coin_balance}</span>
                    </div>
                    <p className="text-xs text-[#68665F] mt-1">Coins available to redeem</p>
                    <div className="mt-3">
                        <span className="badge-coin px-2.5 py-1 rounded-full text-xs font-semibold">
                            +{state.coins_today || 0} Today
                        </span>
                    </div>
                    <p className="text-xs text-[#68665F] mt-4">
                        Redeem 500 coins for 7 days of Premium access.
                    </p>
                    <Link
                        to="/wallet"
                        className="inline-block mt-3 text-xs font-semibold text-[#174A3A] hover:underline"
                    >
                        View Ledger →
                    </Link>
                </div>

                {/* Streak */}
                <div className="editorial-panel p-6 rounded-lg">
                    <p className="eyebrow mb-3">Daily Activity Streak</p>
                    <p className="text-4xl font-bold text-[#1C1C1A]">🔥 {state.streak_days} Day</p>
                    <p className="text-xs text-[#68665F] mt-1">Longest streak: {state.longest_streak} days</p>
                    <div className="grid grid-cols-7 gap-1.5 mt-4">
                        {WEEK_DAYS.map((day) => (
                            <div key={day} className="flex flex-col items-center gap-1">
                                <div
                                    className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold ${active.has(day)
                                            ? "bg-[#174A3A] text-white"
                                            : "bg-[#FAF7F0] text-[#68665F] border border-[#E5E0D5]"
                                        }`}
                                >
                                    {active.has(day) ? "✓" : "○"}
                                </div>
                                <span className="text-[9px] text-[#68665F] font-medium">{day}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-[#68665F] mt-4">
                        Practise daily to keep your streak alive. 7 days unlocks a 50 coin bonus.
                    </p>
                </div>

                {/* Daily mission */}
                <div className="editorial-panel p-6 rounded-lg">
                    <p className="eyebrow mb-3">Today's Training Mission</p>
                    <p className="text-lg font-semibold text-[#1C1C1A] leading-snug">
                        ⚡ Daily Vocal Warm-up
                    </p>
                    <p className="text-xs text-[#68665F] mt-2 leading-relaxed">
                        60 seconds. One random prompt. Practice thinking and speaking out loud to keep your streak alive.
                    </p>
                    <div className="flex gap-2 mt-4">
                        <span className="badge-coin px-2.5 py-1 rounded-full text-xs font-semibold">+15 Coins</span>
                        <span className="badge-forest px-2.5 py-1 rounded-full text-xs font-semibold">+25 XP</span>
                    </div>
                    <Link
                        to="/communication?mode=warmup"
                        className="btn-primary inline-flex items-center justify-center mt-5 px-5 py-2.5 font-semibold rounded-md text-sm shadow-sm"
                    >
                        Start Today's Warm-up →
                    </Link>
                </div>
            </div>

            {/* Readiness score */}
            <div className="editorial-panel p-7 rounded-lg">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
                    <div>
                        <p className="eyebrow mb-1 flex items-center">
                            Career Readiness Score
                            <ReadinessScoreTooltip />
                        </p>
                        <p className="text-3xl font-bold text-[#174A3A]">{readiness}<span className="text-base text-[#68665F] font-medium"> /100</span></p>
                    </div>
                    <div className="w-full sm:w-72">
                        <ScoreBar value={readiness} />
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    <ScoreCard label="Resume" score={state.resume_score} />
                    <ScoreCard label="Communication" score={state.communication_score} />
                    <ScoreCard label="Technical" score={state.technical_score} />
                    <ScoreCard label="Interview" score={state.interview_score} />
                </div>

                <div>
                    <p className="eyebrow mb-3">Top 3 Areas to Improve</p>
                    <div className="space-y-3">
                        {weaknesses.map((w) => (
                            <div key={w.label} className="flex items-center gap-4">
                                <span className="text-sm font-medium text-[#1C1C1A] w-56 shrink-0">{w.label}</span>
                                <div className="flex-1">
                                    <ScoreBar value={w.score} color={w.score < 55 ? "#A44732" : "#C8922E"} />
                                </div>
                                <span className="text-sm font-semibold text-[#68665F] w-12 text-right">{w.score}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}