import React, { useState } from "react";
import { POPULAR_ROLES } from "@/lib/careerRoadmapData";

export default function TargetJobSelector({
    selectedRole,
    onSelectRole,
    jobDescription,
    onChangeJobDescription,
    onGenerateRoadmap,
    loading
}) {
    const [customRole, setCustomRole] = useState("");
    const [showJdInput, setShowJdInput] = useState(Boolean(jobDescription));

    function handleQuickSelect(role) {
        onSelectRole(role);
        setCustomRole("");
    }

    function handleCustomSubmit(e) {
        e.preventDefault();
        const trimmed = customRole.trim();
        if (trimmed) {
            onSelectRole(trimmed);
        }
    }

    return (
        <div className="editorial-panel p-6 rounded-lg space-y-5">
            <div>
                <p className="eyebrow text-[#174A3A]">Target Role Selection</p>
                <p className="text-xs text-[#68665F]">
                    Select or type your desired target role. Career Coach AI will evaluate your profile against its competency benchmarks.
                </p>
            </div>

            {/* Popular Roles Grid */}
            <div className="flex flex-wrap gap-2">
                {POPULAR_ROLES.map((role) => {
                    const isSelected = selectedRole?.toLowerCase() === role.toLowerCase();
                    return (
                        <button
                            key={role}
                            type="button"
                            onClick={() => handleQuickSelect(role)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                                isSelected
                                    ? "bg-[#174A3A] text-white shadow-sm ring-2 ring-[#174A3A] ring-offset-1"
                                    : "bg-[#FAF7F0] text-[#1C1C1A] border border-[#D9D3C7] hover:border-[#174A3A]"
                            }`}
                        >
                            {isSelected ? "✓ " : ""}{role}
                        </button>
                    );
                })}
            </div>

            {/* Custom Role Input */}
            <form onSubmit={handleCustomSubmit} className="flex gap-2">
                <input
                    type="text"
                    className="input-editorial flex-1 text-xs py-1.5"
                    placeholder="Or enter a custom role (e.g. Site Reliability Engineer, Blockchain Developer)..."
                    value={customRole}
                    onChange={(e) => setCustomRole(e.target.value)}
                />
                <button
                    type="submit"
                    disabled={!customRole.trim()}
                    className="px-3 py-1.5 text-xs bg-[#FAF7F0] border border-[#D9D3C7] hover:border-[#174A3A] text-[#174A3A] font-semibold rounded-md disabled:opacity-50 transition-colors"
                >
                    Apply Custom Role
                </button>
            </form>

            {/* Specific Job Description Toggle */}
            <div className="pt-3 border-t border-[#E5E0D5]">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-semibold text-[#1C1C1A]">
                        Compare with a specific job posting? (Optional)
                    </span>
                    <button
                        type="button"
                        onClick={() => setShowJdInput(v => !v)}
                        className="text-xs text-[#174A3A] font-semibold hover:underline"
                    >
                        {showJdInput ? "Hide Job Description" : "+ Paste Job Description"}
                    </button>
                </div>

                {showJdInput && (
                    <div className="space-y-2 mt-2">
                        <textarea
                            className="input-editorial w-full min-h-28 text-xs font-mono"
                            placeholder="Paste the full job description or requirements here. The AI will extract the exact requirements and compare your profile..."
                            value={jobDescription}
                            onChange={(e) => onChangeJobDescription(e.target.value)}
                        />
                        <p className="text-[11px] text-[#68665F]">
                            Tip: Include the "Qualifications" and "Responsibilities" sections for the most accurate gap analysis.
                        </p>
                    </div>
                )}
            </div>

            <div className="pt-2">
                <button
                    type="button"
                    onClick={onGenerateRoadmap}
                    disabled={loading || !selectedRole}
                    className="w-full sm:w-auto px-6 py-2.5 bg-[#174A3A] hover:bg-[#123A2D] text-white text-xs font-bold rounded-md shadow transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            <span>Generating Personalized Roadmap…</span>
                        </>
                    ) : (
                        <>
                            <span>🚀 Generate Job Readiness & Career Roadmap</span>
                        </>
                    )}
                </button>
            </div>
        </div>
    );
}
