import React from "react";

export default function VerifiedLearningPath({ certifications = [], project, targetRole }) {
    return (
        <div className="space-y-6">
            {/* Practical Project Blueprint Card */}
            {project && (
                <div className="editorial-panel p-6 rounded-lg space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="badge-forest text-[10px] px-2 py-0.5 rounded font-bold uppercase">
                                    CAPSTONE PORTFOLIO PROJECT
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-[#1C1C1A]">{project.title}</h3>
                        </div>
                        <span className="text-xs bg-[#FAF7F0] border border-[#D9D3C7] px-2.5 py-1 rounded font-semibold text-[#174A3A] self-start sm:self-auto">
                            Target: {targetRole}
                        </span>
                    </div>

                    <p className="text-xs text-[#68665F] leading-relaxed">
                        <span className="font-semibold text-[#1C1C1A]">Objective: </span>
                        {project.objective}
                    </p>

                    {/* Tech Stack Pills */}
                    <div>
                        <span className="text-xs font-semibold text-[#1C1C1A] block mb-1.5">Required Tech Stack:</span>
                        <div className="flex flex-wrap gap-1.5">
                            {(project.tech_stack || []).map((tech) => (
                                <span key={tech} className="badge-forest text-xs px-2.5 py-1 rounded-full font-medium">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Milestones */}
                    <div className="bg-[#FAF7F0] p-4 rounded-lg border border-[#E5E0D5]">
                        <span className="text-xs font-bold text-[#174A3A] block mb-2">Implementation Milestones:</span>
                        <ol className="space-y-2">
                            {(project.milestones || []).map((m, idx) => (
                                <li key={idx} className="text-xs text-[#1C1C1A] flex items-start gap-2">
                                    <span className="font-bold text-[#174A3A] shrink-0">{idx + 1}.</span>
                                    <span>{m}</span>
                                </li>
                            ))}
                        </ol>
                    </div>

                    {/* Testing, Documentation & Resume Presentation */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                        <div className="bg-white p-3 rounded border border-[#E5E0D5]">
                            <span className="font-semibold text-[#174A3A] block mb-1">How to Test & Verify:</span>
                            <p className="text-[11px] text-[#68665F]">{project.test_approach}</p>
                        </div>
                        <div className="bg-white p-3 rounded border border-[#E5E0D5]">
                            <span className="font-semibold text-[#174A3A] block mb-1">Recommended Resume Presentation:</span>
                            <p className="text-[11px] text-[#1C1C1A] italic">"{project.resume_bullet}"</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Verified Certifications & Courses Card */}
            <div className="editorial-panel p-6 rounded-lg space-y-4">
                <div>
                    <p className="eyebrow text-[#174A3A]">Personalized Verified Certifications & Courses</p>
                    <p className="text-xs text-[#68665F]">
                        Curated credentials with verified official providers, costs, and free learning alternatives.
                    </p>
                </div>

                <div className="space-y-4">
                    {certifications.map((cert, idx) => (
                        <div key={idx} className="p-4 rounded-lg border border-[#E5E0D5] bg-white space-y-3">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-sm text-[#1C1C1A]">{cert.name}</span>
                                    </div>
                                    <p className="text-xs text-[#68665F]">
                                        Provider: <span className="font-semibold text-[#1C1C1A]">{cert.provider}</span> · {cert.duration} · {cert.cost}
                                    </p>
                                </div>

                                {cert.url && (
                                    <a
                                        href={cert.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 px-3 py-1 bg-[#FAF7F0] border border-[#174A3A] text-[#174A3A] hover:bg-[#174A3A] hover:text-white rounded text-xs font-semibold transition-colors self-start sm:self-auto shrink-0"
                                    >
                                        <span>Official Syllabus</span>
                                        <span>↗</span>
                                    </a>
                                )}
                            </div>

                            <p className="text-xs text-[#1C1C1A]">
                                <span className="font-semibold text-[#174A3A]">Relevance: </span>
                                {cert.relevance}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                                <div className="bg-[#FAF7F0] p-2.5 rounded border border-[#E5E0D5]">
                                    <span className="font-semibold text-[#174A3A] block mb-0.5">Free Learning Alternative:</span>
                                    <span className="text-[#68665F]">{cert.free_alternative}</span>
                                </div>
                                <div className="bg-[#E8F2EE] p-2.5 rounded border border-[#B8DACD]">
                                    <span className="font-semibold text-[#2F6B57] block mb-0.5">Project vs Certificate Advice:</span>
                                    <span className="text-[#174A3A]">{cert.project_alternative}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Practical Internship & Real Experience Pathway */}
            <div className="editorial-card p-5 rounded-lg border-l-4 border-l-[#174A3A] space-y-3">
                <p className="eyebrow text-[#174A3A]">Practical Experience & Internship Pathways</p>
                <p className="text-xs text-[#68665F]">
                    Distinguishing professional experience from personal projects. High-yield ways to build verifiable work experience:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-white p-3 rounded border border-[#E5E0D5]">
                        <span className="font-bold text-[#1C1C1A] block mb-1">1. Open-Source Contributions</span>
                        <p className="text-[11px] text-[#68665F]">
                            Search GitHub issues labeled <code className="bg-[#F3EFE6] px-1 py-0.5 rounded">good-first-issue</code> in relevant repositories to demonstrate real pull-request collaboration and code review.
                        </p>
                    </div>
                    <div className="bg-white p-3 rounded border border-[#E5E0D5]">
                        <span className="font-bold text-[#1C1C1A] block mb-1">2. Hackathons & Competitions</span>
                        <p className="text-[11px] text-[#68665F]">
                            Participate in Devpost, Kaggle, or MLH events. Placements or completed project submissions provide timestamped proof of team delivery under deadlines.
                        </p>
                    </div>
                    <div className="bg-white p-3 rounded border border-[#E5E0D5]">
                        <span className="font-bold text-[#1C1C1A] block mb-1">3. Early-Stage / Pro-Bono Work</span>
                        <p className="text-[11px] text-[#68665F]">
                            Build tools for local businesses, non-profits, or university research labs to gain verifiable references and production user metrics.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
