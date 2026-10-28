import React, { useState } from "react";
import { Link } from "react-router-dom";
import { levelFor, readinessScore } from "@/lib/careerData";
import ScoreBar from "@/components/ui/ScoreBar";
import ReadinessScoreTooltip from "@/components/ReadinessScoreTooltip";

const DEMO_STATE = {
    target_role: "Software Engineer",
    experience_level: "entry",
    coin_balance: 245,
    lifetime_earned: 295,
    lifetime_spent: 50,
    xp: 340,
    streak_days: 6,
    longest_streak: 10,
    active_days: ["MON", "TUE", "WED", "THU", "FRI", "SAT"],
    coins_today: 15,
    plan: "FREE",
    resume_score: 82,
    communication_score: 64,
    technical_score: 78,
    interview_score: 69,
};

const FEATURES = [
    {
        href: "/resume",
        emoji: "📄",
        title: "Resume Intelligence Studio",
        desc: "Upload your resume for section, skill and metric extraction — then match it against any job description."
    },
    {
        href: "/communication",
        emoji: "🎙️",
        title: "Communication Practice Coach",
        desc: "Record a 60-second answer and get real transcription, pace (WPM) and filler-word analysis."
    },
    {
        href: "/interview",
        emoji: "💬",
        title: "AI Mock Interview Studio",
        desc: "Resume-grounded questions, STAR-structured answer evaluation, and a session deep review."
    },
    {
        href: "/dashboard",
        emoji: "📈",
        title: "Career Progression Studio",
        desc: "Readiness score, level progression, streaks and a Career Coin wallet that rewards real practice."
    }
];

export default function Demo() {
    const [bannerVisible, setBannerVisible] = useState(true);
    const state = DEMO_STATE;
    const level = levelFor(state.xp);
    const readiness = readinessScore(state);

    return (
        <div>
            {/* Demo banner */}
            {bannerVisible && (
                <div className="mb-8 flex items-start gap-4 rounded-lg border border-[#F4C0C0] bg-[#FEF0F0] px-5 py-4">
                    <span className="text-xl">🎬</span>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#A44732]">You&rsquo;re viewing a demo</p>
                        <p className="text-xs text-[#C05F4A] mt-0.5 leading-relaxed">
                            This is a pre-loaded demo with sample data so you can explore all features.
                            Data is not saved between sessions in demo mode.
                        </p>
                    </div>
                    <button
                        onClick={() => setBannerVisible(false)}
                        className="shrink-0 text-[#A44732] hover:text-[#7B3328] text-lg leading-none"
                        aria-label="Dismiss demo banner"
                    >
                        ×
                    </button>
                </div>
            )}

            {/* Hero */}
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-14">
                <div className="lg:col-span-2">
                    <p className="eyebrow mb-4">AI-Powered Career Readiness Coach</p>
                    <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-[#1C1C1A] leading-[1.05]">
                        Land the role.
                        <br />
                        <span className="text-[#174A3A]">Train with intent.</span>
                    </h1>
                    <p className="mt-6 text-lg text-[#68665F] max-w-2xl leading-relaxed">
                        A purpose-built career training platform combining an interview practice studio, skill progression
                        tracking, and AI coaching — grounded in your real resume.
                    </p>
                    <div className="mt-8 flex flex-wrap gap-3">
                        <Link
                            to="/dashboard"
                            className="btn-primary px-6 py-3 font-semibold rounded-md text-sm shadow-sm"
                        >
                            Open Career Studio →
                        </Link>
                        <Link
                            to="/interview"
                            className="px-6 py-3 font-semibold rounded-md text-sm border border-[#D9D3C7] text-[#1C1C1A] hover:border-[#174A3A] hover:text-[#174A3A] transition-colors"
                        >
                            Start a Mock Interview
                        </Link>
                    </div>
                </div>

                <div className="editorial-panel p-7 rounded-lg">
                    <p className="eyebrow mb-4">Your Progress</p>
                    <div className="mb-6">
                        <p className="text-sm text-[#68665F] flex items-center">
                            Career Readiness
                            <ReadinessScoreTooltip />
                        </p>
                        <div className="flex items-baseline gap-1 mt-1">
                            <span className="text-5xl font-bold text-[#174A3A]">{readiness}</span>
                            <span className="text-sm text-[#68665F]">/100</span>
                        </div>
                        <div className="mt-3">
                            <ScoreBar value={readiness} />
                        </div>
                    </div>
                    <div className="pt-5 border-t border-[#E5E0D5]">
                        <p className="text-sm text-[#68665F]">Current Level</p>
                        <p className="text-lg font-semibold text-[#1C1C1A] mt-0.5">
                            L{level.level} · {level.title}
                        </p>
                        <div className="mt-2">
                            <ScoreBar value={level.progress} />
                        </div>
                        <p className="text-xs text-[#68665F] mt-2">
                            {state.xp} XP{level.next ? ` · ${level.next.xp - state.xp} XP to ${level.next.title}` : " · Max level"}
                        </p>
                    </div>
                </div>
            </section>

            {/* Feature grid */}
            <section>
                <div className="border-b border-[#D9D3C7] pb-6 mb-8">
                    <p className="eyebrow mb-2">Training Modules</p>
                    <h2 className="text-3xl font-bold tracking-tight text-[#1C1C1A]">Four studios. One readiness score.</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {FEATURES.map((f) => (
                        <Link
                            key={f.href}
                            to={f.href}
                            className="editorial-card p-7 rounded-md block group"
                        >
                            <div className="text-3xl mb-4">{f.emoji}</div>
                            <h3 className="text-lg font-semibold text-[#1C1C1A] mb-2 group-hover:text-[#174A3A] transition-colors">
                                {f.title}
                            </h3>
                            <p className="text-sm text-[#68665F] leading-relaxed">{f.desc}</p>
                            <p className="mt-4 text-xs font-semibold text-[#174A3A]">Open →</p>
                        </Link>
                    ))}
                </div>
            </section>
        </div>
    );
}
