import React, { useState } from "react";

export default function ProfileEditor({ profile, confirmedSkills, onUpdateConfirmedSkills, onUpdateProfile }) {
    const [newSkill, setNewSkill] = useState("");
    const [editingSummary, setEditingSummary] = useState(false);
    const [summaryText, setSummaryText] = useState(profile?.profile_summary || "");

    const skills = confirmedSkills || [];

    function handleAddSkill(e) {
        e.preventDefault();
        const trimmed = newSkill.trim();
        if (!trimmed) return;
        if (!skills.some(s => s.toLowerCase() === trimmed.toLowerCase())) {
            const updated = [...skills, trimmed];
            onUpdateConfirmedSkills(updated);
        }
        setNewSkill("");
    }

    function handleRemoveSkill(skillToRemove) {
        const updated = skills.filter(s => s !== skillToRemove);
        onUpdateConfirmedSkills(updated);
    }

    function handleSaveSummary() {
        setEditingSummary(false);
        if (onUpdateProfile) {
            onUpdateProfile({ ...profile, profile_summary: summaryText });
        }
    }

    return (
        <div className="space-y-6">
            {/* Candidate Profile Summary */}
            <div className="editorial-panel p-6 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                    <p className="eyebrow text-[#174A3A]">Extracted Candidate Profile Summary</p>
                    <button
                        onClick={() => {
                            if (editingSummary) handleSaveSummary();
                            else {
                                setSummaryText(profile?.profile_summary || "");
                                setEditingSummary(true);
                            }
                        }}
                        className="text-xs font-semibold text-[#174A3A] hover:underline"
                    >
                        {editingSummary ? "Save Summary" : "Edit Summary"}
                    </button>
                </div>

                {editingSummary ? (
                    <div className="space-y-2">
                        <textarea
                            className="input-editorial w-full min-h-24 text-sm"
                            value={summaryText}
                            onChange={(e) => setSummaryText(e.target.value)}
                            placeholder="Edit your executive profile summary..."
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setEditingSummary(false)}
                                className="px-3 py-1 text-xs text-[#68665F] hover:bg-[#F3EFE6] rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveSummary}
                                className="px-3 py-1 text-xs bg-[#174A3A] text-white font-medium rounded hover:bg-[#123A2D]"
                            >
                                Save
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-[#1C1C1A] leading-relaxed">
                        {profile?.profile_summary || "Candidate profile extracted from uploaded resume. You can review, refine, and confirm skills below without re-uploading."}
                    </p>
                )}

                {/* Education and Experience Quick Glance */}
                {(profile?.education?.length > 0 || profile?.experience?.length > 0) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#E5E0D5]">
                        {profile?.education?.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-[#68665F] uppercase mb-2">Education & Qualifications</p>
                                <ul className="space-y-1.5">
                                    {profile.education.map((edu, i) => (
                                        <li key={i} className="text-xs text-[#1C1C1A]">
                                            <span className="font-semibold">{edu.degree || "Degree"}</span>
                                            {edu.field && ` in ${edu.field}`}
                                            {edu.institution && ` · ${edu.institution}`}
                                            {edu.year && <span className="text-[#68665F]"> ({edu.year})</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        {profile?.experience?.length > 0 && (
                            <div>
                                <p className="text-xs font-semibold text-[#68665F] uppercase mb-2">Experience & Internships</p>
                                <ul className="space-y-1.5">
                                    {profile.experience.map((exp, i) => (
                                        <li key={i} className="text-xs text-[#1C1C1A]">
                                            <span className="font-semibold">{exp.role || "Role"}</span>
                                            {exp.company && ` · ${exp.company}`}
                                            {exp.duration && <span className="text-[#68665F]"> ({exp.duration})</span>}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Confirmed Skills Editor */}
            <div className="editorial-panel p-6 rounded-lg">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <p className="eyebrow text-[#174A3A]">Verified & Confirmed Skills ({skills.length})</p>
                        <p className="text-xs text-[#68665F]">
                            You can add skills you possess or remove any incorrect extractions without having to re-upload.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleAddSkill} className="flex gap-2 mb-4">
                    <input
                        type="text"
                        className="input-editorial flex-1 text-sm py-1.5"
                        placeholder="Add a verified skill (e.g. Docker, TypeScript, PostgreSQL)..."
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                    />
                    <button
                        type="submit"
                        disabled={!newSkill.trim()}
                        className="px-4 py-1.5 bg-[#174A3A] text-white text-xs font-semibold rounded-md hover:bg-[#123A2D] disabled:opacity-50 transition-colors"
                    >
                        + Add Skill
                    </button>
                </form>

                <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                        <span
                            key={skill}
                            className="inline-flex items-center gap-1.5 badge-forest px-3 py-1 rounded-full text-xs font-medium"
                        >
                            <span>{skill}</span>
                            <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className="text-[#174A3A] hover:text-[#A44732] font-bold text-xs ml-0.5"
                                title="Remove skill"
                            >
                                ×
                            </button>
                        </span>
                    ))}
                    {!skills.length && (
                        <p className="text-xs text-[#68665F]">No skills confirmed yet. Upload a resume or add skills manually above.</p>
                    )}
                </div>
            </div>

            {/* Resume Quality vs Capability Gaps Diagnostic */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="editorial-card p-5 rounded-lg border-l-4 border-l-[#C8922E]">
                    <div className="flex items-center justify-between mb-2">
                        <p className="eyebrow text-[#C8922E]">Resume Quality & Presentation</p>
                        <span className="text-xs bg-[#FBF3E4] text-[#C8922E] px-2 py-0.5 rounded font-semibold">Presentation Gap</span>
                    </div>
                    <p className="text-xs text-[#68665F] mb-3">
                        Issues with how your achievements are communicated on paper (formatting, quantifiable impact, action verbs).
                    </p>
                    <ul className="space-y-1.5">
                        {profile?.resume_quality_issues?.length > 0 ? (
                            profile.resume_quality_issues.map((issue, i) => (
                                <li key={i} className="text-xs text-[#1C1C1A] flex gap-2">
                                    <span className="text-[#C8922E]">⚠</span>
                                    <span>{issue}</span>
                                </li>
                            ))
                        ) : (
                            <>
                                <li className="text-xs text-[#1C1C1A] flex gap-2">
                                    <span className="text-[#2F6B57]">✓</span>
                                    <span>Sections are clearly segmented.</span>
                                </li>
                                <li className="text-xs text-[#1C1C1A] flex gap-2">
                                    <span className="text-[#C8922E]">⚠</span>
                                    <span>Strengthen bullet points with quantified outcomes (e.g., % improvement, users served).</span>
                                </li>
                            </>
                        )}
                    </ul>
                </div>

                <div className="editorial-card p-5 rounded-lg border-l-4 border-l-[#A44732]">
                    <div className="flex items-center justify-between mb-2">
                        <p className="eyebrow text-[#A44732]">Role Capability Gaps</p>
                        <span className="text-xs bg-[#FDF2F0] text-[#A44732] px-2 py-0.5 rounded font-semibold">Knowledge Gap</span>
                    </div>
                    <p className="text-xs text-[#68665F] mb-3">
                        Actual technical skills, tooling, or architectural experience needed for your target role that require learning.
                    </p>
                    <ul className="space-y-1.5">
                        {profile?.capability_gaps?.length > 0 ? (
                            profile.capability_gaps.map((gap, i) => (
                                <li key={i} className="text-xs text-[#1C1C1A] flex gap-2">
                                    <span className="text-[#A44732]">✕</span>
                                    <span>{gap}</span>
                                </li>
                            ))
                        ) : (
                            <li className="text-xs text-[#68665F]">
                                Run a target job comparison to see role-specific capability requirements.
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
