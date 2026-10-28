import React from "react";
import ScoreBar from "@/components/ui/ScoreBar";

export default function JobReadinessDashboard({
    targetRole,
    readinessScore,
    skillMatchScore,
    resumeScore,
    completedTasksCount,
    totalTasksCount,
    requirementBreakdown = [],
    onNavigateToRoadmap,
    onNavigateToInterview
}) {
    const roadmapProgressPct = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;
    
    // Transparent deterministic formula: 40% Skill Match + 30% Resume Score + 30% Roadmap Tasks Completed
    const computedReadiness = Math.round(
        (0.40 * (skillMatchScore || 0)) +
        (0.30 * (resumeScore || 0)) +
        (0.30 * roadmapProgressPct)
    );

    const scoreColor = computedReadiness >= 75 ? "#2F6B57" : computedReadiness >= 50 ? "#C8922E" : "#A44732";

    const demonstratedCount = requirementBreakdown.filter(r => r.status === "demonstrated").length;
    const gapCount = requirementBreakdown.filter(r => r.status === "not_demonstrated" || r.status === "partially_demonstrated").length;

    // Next recommended action determination
    let nextActionTitle = "Close Top Essential Skill Gap";
    let nextActionDesc = "Work on the essential requirements in Stage 2 of your roadmap to raise your skill match.";
    if (roadmapProgressPct < 20) {
        nextActionTitle = "Check Off Immediate Priorities";
        nextActionDesc = "Complete Stage 1 tasks to fix resume bullet points and verify all your hands-on competencies.";
    } else if (roadmapProgressPct >= 60 && computedReadiness < 80) {
        nextActionTitle = "Run a Mock Interview Drill";
        nextActionDesc = "Validate your prepared technical skills in the Interview Studio to convert knowledge into strong verbal delivery.";
    } else if (roadmapProgressPct >= 80) {
        nextActionTitle = "Begin Targeted Job Applications";
        nextActionDesc = "Your verified readiness is high. Start applying to verified openings with your tailored portfolio.";
    }

    return (
        <div className="space-y-6">
            {/* Top Readiness Score Card */}
            <div className="editorial-panel p-6 rounded-lg bg-gradient-to-br from-[#FAF7F0] to-[#F3EFE6] border border-[#D9D3C7]">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="badge-forest text-[11px] px-2.5 py-0.5 rounded-full font-bold">
                                TARGET ROLE: {targetRole?.toUpperCase() || "SOFTWARE ENGINEER"}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-[#1C1C1A]">Job Readiness Intelligence Score</h3>
                        <p className="text-xs text-[#68665F]">
                            Evidence-based composite score tracking verified qualifications and completed preparation milestones.
                        </p>
                    </div>

                    <div className="flex items-baseline gap-2 shrink-0 bg-white px-5 py-3 rounded-lg border border-[#D9D3C7] shadow-sm">
                        <span className="text-4xl font-extrabold" style={{ color: scoreColor }}>
                            {computedReadiness}
                        </span>
                        <span className="text-xs text-[#68665F] font-medium">/ 100</span>
                    </div>
                </div>

                <ScoreBar value={computedReadiness} color={scoreColor} className="h-3 rounded-full mb-6" />

                {/* Formula Breakdown Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#E5E0D5]">
                    <div className="bg-white/80 p-3 rounded-md border border-[#E5E0D5]">
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="text-xs font-semibold text-[#1C1C1A]">Demonstrated Skill Match</span>
                            <span className="text-xs font-bold text-[#2F6B57]">{skillMatchScore || 0}%</span>
                        </div>
                        <ScoreBar value={skillMatchScore || 0} color="#2F6B57" className="h-1.5" />
                        <span className="text-[11px] text-[#68665F] mt-1 block">Weight: 40% of total score</span>
                    </div>

                    <div className="bg-white/80 p-3 rounded-md border border-[#E5E0D5]">
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="text-xs font-semibold text-[#1C1C1A]">Resume Presentation</span>
                            <span className="text-xs font-bold text-[#174A3A]">{resumeScore || 0}%</span>
                        </div>
                        <ScoreBar value={resumeScore || 0} color="#174A3A" className="h-1.5" />
                        <span className="text-[11px] text-[#68665F] mt-1 block">Weight: 30% of total score</span>
                    </div>

                    <div className="bg-white/80 p-3 rounded-md border border-[#E5E0D5]">
                        <div className="flex justify-between items-baseline mb-1">
                            <span className="text-xs font-semibold text-[#1C1C1A]">Roadmap Completion</span>
                            <span className="text-xs font-bold text-[#C8922E]">{roadmapProgressPct}%</span>
                        </div>
                        <ScoreBar value={roadmapProgressPct} color="#C8922E" className="h-1.5" />
                        <span className="text-[11px] text-[#68665F] mt-1 block">
                            {completedTasksCount} of {totalTasksCount} tasks (30% weight)
                        </span>
                    </div>
                </div>

                {/* Honest Reporting Disclaimer */}
                <div className="mt-4 p-3 bg-white/60 rounded border border-[#E5E0D5] text-[11px] text-[#68665F] leading-normal flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0">ℹ Note:</span>
                    <span>
                        This readiness score measures demonstrated profile evidence and roadmap completion. It is not an arbitrary hiring probability, as hiring decisions depend on live employer interviews, behavioral alignment, and portfolio depth.
                    </span>
                </div>
            </div>

            {/* Quick Metrics & Next Action Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="editorial-card p-5 rounded-lg flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#E8F2EE] text-[#2F6B57] flex items-center justify-center font-bold text-lg">
                        ✓
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[#1C1C1A]">{demonstratedCount}</p>
                        <p className="text-xs text-[#68665F]">Demonstrated Requirements</p>
                    </div>
                </div>

                <div className="editorial-card p-5 rounded-lg flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#FDF2F0] text-[#A44732] flex items-center justify-center font-bold text-lg">
                        ⚠
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[#1C1C1A]">{gapCount}</p>
                        <p className="text-xs text-[#68665F]">Identified Gaps to Close</p>
                    </div>
                </div>

                <div className="editorial-card p-5 rounded-lg border-l-4 border-l-[#174A3A]">
                    <p className="eyebrow text-[#174A3A] mb-1">Next Recommended Action</p>
                    <p className="text-xs font-bold text-[#1C1C1A] mb-1">{nextActionTitle}</p>
                    <p className="text-[11px] text-[#68665F]">{nextActionDesc}</p>
                </div>
            </div>
        </div>
    );
}
