import React, { useState } from "react";

export default function RequirementGapAnalysis({ requirementBreakdown = [], targetRole }) {
    const [filter, setFilter] = useState("all"); // 'all', 'demonstrated', 'gaps'

    const filteredReqs = requirementBreakdown.filter((req) => {
        if (filter === "demonstrated") return req.status === "demonstrated";
        if (filter === "gaps") return req.status !== "demonstrated";
        return true;
    });

    const getStatusBadge = (status) => {
        switch (status) {
            case "demonstrated":
                return {
                    label: "Demonstrated",
                    bg: "bg-[#E8F2EE] text-[#2F6B57] border-[#B8DACD]",
                    icon: "✓"
                };
            case "partially_demonstrated":
                return {
                    label: "Partially Demonstrated",
                    bg: "bg-[#FBF3E4] text-[#C8922E] border-[#F4E2BE]",
                    icon: "◑"
                };
            case "needs_confirmation":
                return {
                    label: "Needs Confirmation",
                    bg: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
                    icon: "?"
                };
            default:
                return {
                    label: "Not Demonstrated",
                    bg: "bg-[#FDF2F0] text-[#A44732] border-[#F4D0C8]",
                    icon: "✕"
                };
        }
    };

    return (
        <div className="editorial-panel p-6 rounded-lg space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <p className="eyebrow text-[#174A3A]">Job Requirement Gap Analysis</p>
                    <p className="text-xs text-[#68665F]">
                        Structured comparison of your profile against target competencies for {targetRole}.
                    </p>
                </div>

                {/* Filter Pills */}
                <div className="flex gap-1.5 self-start sm:self-auto">
                    <button
                        type="button"
                        onClick={() => setFilter("all")}
                        className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                            filter === "all" ? "bg-[#174A3A] text-white" : "bg-[#FAF7F0] text-[#68665F] hover:bg-[#F3EFE6]"
                        }`}
                    >
                        All ({requirementBreakdown.length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilter("gaps")}
                        className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                            filter === "gaps" ? "bg-[#A44732] text-white" : "bg-[#FAF7F0] text-[#68665F] hover:bg-[#F3EFE6]"
                        }`}
                    >
                        Gaps to Close ({requirementBreakdown.filter(r => r.status !== "demonstrated").length})
                    </button>
                    <button
                        type="button"
                        onClick={() => setFilter("demonstrated")}
                        className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                            filter === "demonstrated" ? "bg-[#2F6B57] text-white" : "bg-[#FAF7F0] text-[#68665F] hover:bg-[#F3EFE6]"
                        }`}
                    >
                        Demonstrated ({requirementBreakdown.filter(r => r.status === "demonstrated").length})
                    </button>
                </div>
            </div>

            {/* Requirements Accordion / Card List */}
            <div className="space-y-3 pt-2">
                {filteredReqs.map((req) => {
                    const badge = getStatusBadge(req.status);
                    const isEssential = req.importance === "essential";

                    return (
                        <div
                            key={req.id}
                            className={`p-4 rounded-lg border transition-all ${
                                req.status === "demonstrated"
                                    ? "bg-white border-[#E5E0D5]"
                                    : "bg-white border-[#E5E0D5] hover:border-[#174A3A]"
                            }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-sm text-[#1C1C1A]">{req.skill}</span>
                                    <span
                                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                            isEssential
                                                ? "bg-[#174A3A] text-white"
                                                : "bg-[#F3EFE6] text-[#68665F]"
                                        }`}
                                    >
                                        {req.importance}
                                    </span>
                                </div>

                                <span
                                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full border ${badge.bg}`}
                                >
                                    <span>{badge.icon}</span>
                                    <span>{badge.label}</span>
                                </span>
                            </div>

                            <p className="text-xs text-[#68665F] mb-3 leading-relaxed">
                                <span className="font-semibold text-[#1C1C1A]">Why it matters: </span>
                                {req.why_it_matters}
                            </p>

                            {/* Detailed Evidence & Closing Strategy Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-3 border-t border-[#F3EFE6] text-xs">
                                <div className="bg-[#FAF7F0] p-2.5 rounded border border-[#E5E0D5]">
                                    <span className="font-semibold text-[#174A3A] block mb-1">
                                        Candidate Profile Evidence:
                                    </span>
                                    <p className="text-[#1C1C1A] text-[11px] leading-normal">{req.evidence}</p>
                                    {req.status !== "demonstrated" && (
                                        <p className="text-[11px] text-[#A44732] mt-1 font-medium">
                                            {req.gap_explanation}
                                        </p>
                                    )}
                                </div>

                                <div className="bg-[#FAF7F0] p-2.5 rounded border border-[#E5E0D5]">
                                    <span className="font-semibold text-[#174A3A] block mb-1">
                                        Actionable Closing Strategy:
                                    </span>
                                    <p className="text-[#1C1C1A] text-[11px] leading-normal">{req.closing_strategy}</p>
                                    <span className="text-[10px] text-[#68665F] mt-1 block">
                                        <span className="font-semibold">Verification: </span>
                                        {req.verification_method}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}

                {!filteredReqs.length && (
                    <div className="p-8 text-center text-[#68665F] text-xs bg-[#FAF7F0] rounded-lg">
                        No requirements match the selected filter.
                    </div>
                )}
            </div>
        </div>
    );
}
