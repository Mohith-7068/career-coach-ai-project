import React from "react";
import { Link } from "react-router-dom";
import PageHeader from "@/components/ui/PageHeader";

const STUDIOS = [
    {
        emoji: "📄",
        title: "Resume Intelligence Studio",
        description:
            "Extracts skills, ATS structure, section hierarchy, and quantified metrics from your real resume. It identifies blind spots and performs semantic matching against target job descriptions to highlight matching and missing competencies."
    },
    {
        emoji: "🎙️",
        title: "Communication Practice Coach",
        description:
            "Evaluates spontaneous spoken answers against industry communication standards. Using speech-to-text transcription, it measures words per minute (WPM), detects filler words, and scores delivery cadence in real time."
    },
    {
        emoji: "💬",
        title: "AI Mock Interview Studio",
        description:
            "Generates targeted behavioral and technical questions grounded in your resume. Evaluates answers across the STAR framework (Situation, Task, Action, Result) with actionable suggestions for measurable impact."
    },
    {
        emoji: "📈",
        title: "Career Progression Studio",
        description:
            "Aggregates your performance into a unified Career Readiness Score. Features level progression, daily training missions, activity streaks, and a Career Coin reward wallet to gamify consistent interview preparation."
    }
];

export default function About() {
    return (
        <div>
            <PageHeader
                eyebrow="How It Works"
                title="About CareerCoach.ai"
                subtitle="An AI-powered career training platform designed to prepare candidates for high-stakes technical and behavioral interviews."
            />

            {/* 1. What CareerCoach.ai is and who it's for */}
            <div className="editorial-panel p-8 sm:p-10 rounded-lg mb-10">
                <p className="eyebrow mb-3 text-[#174A3A]">Platform Overview</p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1C1A] mb-4">
                    Purpose-built interview prep grounded in your experience.
                </h2>
                <p className="text-[#68665F] text-base leading-relaxed max-w-3xl">
                    CareerCoach.ai is an intelligent interview preparation and career readiness workspace built for engineers, product managers, and modern job seekers. Unlike generic interview cheat sheets or static question banks, CareerCoach.ai connects your actual resume to realistic mock interview simulations, real-time speech cadence analysis, and personalized skill tracking — giving you objective feedback before you sit down with a hiring manager.
                </p>
            </div>

            {/* 2. The Four Specialized Studios */}
            <div className="mb-12">
                <div className="border-b border-[#D9D3C7] pb-4 mb-8">
                    <p className="eyebrow mb-1">Core Architecture</p>
                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1C1A]">
                        Four specialized studios. One cohesive loop.
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {STUDIOS.map((studio) => (
                        <div key={studio.title} className="editorial-card p-7 rounded-lg">
                            <div className="text-3xl mb-3.5">{studio.emoji}</div>
                            <h3 className="text-lg font-bold text-[#1C1C1A] mb-2">{studio.title}</h3>
                            <p className="text-sm text-[#68665F] leading-relaxed">
                                {studio.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* 3. How the Career Readiness Score is calculated */}
            <div className="editorial-panel p-8 sm:p-10 rounded-lg mb-12">
                <p className="eyebrow mb-2 text-[#174A3A]">Scoring Architecture</p>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1C1A] mb-4">
                    How the Career Readiness Score is calculated
                </h2>
                <p className="text-sm sm:text-base text-[#68665F] leading-relaxed mb-6 max-w-3xl">
                    Your overall score is a composite index out of 100 that reflects your holistic readiness across both technical depth and verbal delivery. Every practice session in any studio updates that dimension and adjusts your overall score automatically:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 rounded-md bg-[#FAF7F0] border border-[#E5E0D5]">
                        <p className="text-2xl font-bold text-[#174A3A] mb-1">30%</p>
                        <p className="font-semibold text-sm text-[#1C1C1A] mb-1">Resume Quality</p>
                        <p className="text-xs text-[#68665F]">ATS formatting, section presence, and quantified achievement metrics.</p>
                    </div>

                    <div className="p-5 rounded-md bg-[#FAF7F0] border border-[#E5E0D5]">
                        <p className="text-2xl font-bold text-[#174A3A] mb-1">30%</p>
                        <p className="font-semibold text-sm text-[#1C1C1A] mb-1">Communication</p>
                        <p className="text-xs text-[#68665F]">Speaking cadence (120–160 WPM) and filler word suppression (&lt; 3%).</p>
                    </div>

                    <div className="p-5 rounded-md bg-[#FAF7F0] border border-[#E5E0D5]">
                        <p className="text-2xl font-bold text-[#174A3A] mb-1">20%</p>
                        <p className="font-semibold text-sm text-[#1C1C1A] mb-1">Interview Depth</p>
                        <p className="text-xs text-[#68665F]">STAR method completeness, situational framing, and answer specificity.</p>
                    </div>

                    <div className="p-5 rounded-md bg-[#FAF7F0] border border-[#E5E0D5]">
                        <p className="text-2xl font-bold text-[#174A3A] mb-1">20%</p>
                        <p className="font-semibold text-sm text-[#1C1C1A] mb-1">Technical Baseline</p>
                        <p className="text-xs text-[#68665F]">Role-specific skill coverage, technology relevance, and problem solving.</p>
                    </div>
                </div>
            </div>

            {/* 4. A link to /demo ("See it in action") */}
            <div className="text-center py-10 px-6 rounded-lg bg-[#E8F2EE] border border-[#B8DACD]">
                <h3 className="text-2xl font-bold text-[#174A3A] mb-2">Ready to see it in action?</h3>
                <p className="text-sm text-[#2F6B57] max-w-xl mx-auto mb-6">
                    Explore the pre-loaded interactive demo environment with sample scores, mock evaluations, and studio workflows.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <Link
                        to="/demo"
                        className="btn-primary px-7 py-3.5 font-semibold rounded-md text-sm shadow-sm"
                    >
                        Try the Interactive Demo →
                    </Link>
                    <Link
                        to="/"
                        className="px-6 py-3.5 font-semibold rounded-md text-sm border border-[#2F6B57] text-[#174A3A] hover:bg-white transition-colors"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
