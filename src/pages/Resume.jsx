import React, { useEffect, useRef, useState } from "react";
import { usePageState } from "@/lib/usePageState";
import { base44 } from "@/api/base44Client";
import { awardCoins, setScores } from "@/lib/careerState";
import PageHeader from "@/components/ui/PageHeader";
import PrimaryButton from "@/components/ui/PrimaryButton";
import ErrorBanner from "@/components/ui/ErrorBanner";
import ScoreBar from "@/components/ui/ScoreBar";
import Spinner from "@/components/ui/Spinner";
import { buildRoadmapData } from "@/lib/careerRoadmapData";
import ProfileEditor from "@/components/roadmap/ProfileEditor";
import TargetJobSelector from "@/components/roadmap/TargetJobSelector";
import JobReadinessDashboard from "@/components/roadmap/JobReadinessDashboard";
import RequirementGapAnalysis from "@/components/roadmap/RequirementGapAnalysis";
import VerifiedLearningPath from "@/components/roadmap/VerifiedLearningPath";
import InteractiveRoadmap from "@/components/roadmap/InteractiveRoadmap";

const ALL_SECTIONS = ["Contact", "Summary", "Education", "Experience", "Skills", "Projects", "Certifications"];

function getRoadmapStorageKey(userId) {
    return `cc_roadmap_tasks:${userId || "guest"}`;
}

export default function Resume() {
    const { state, refresh } = usePageState();
    const inputRef = useRef(null);

    // Navigation Tabs
    const [activeTab, setActiveTab] = useState("resume"); // "resume" | "readiness" | "roadmap"

    // Resume Upload & Extraction State
    const [fileName, setFileName] = useState("");
    const [fileUrl, setFileUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [analyzing, setAnalyzing] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);
    const [rewarded, setRewarded] = useState(false);

    // Profile & Confirmed Skills
    const [confirmedSkills, setConfirmedSkills] = useState([]);
    const [profile, setProfile] = useState(null);

    // Target Role & Job Match State
    const [targetRole, setTargetRole] = useState(state?.target_role || "Software Engineer");
    const [jobDesc, setJobDesc] = useState("");
    const [generatingRoadmap, setGeneratingRoadmap] = useState(false);
    const [roadmapData, setRoadmapData] = useState(null);

    // Interactive Roadmap Task Completion
    const [completedTaskIds, setCompletedTaskIds] = useState([]);
    const [taskRewardNotice, setTaskRewardNotice] = useState("");

    // Load initial state and persisted roadmap task progress
    useEffect(() => {
        if (state?.target_role) setTargetRole(state.target_role);
        if (state?.last_resume_skills?.length && !confirmedSkills.length) {
            setConfirmedSkills(state.last_resume_skills);
        }
        try {
            const userScope = state?.id || "guest";
            const saved = localStorage.getItem(getRoadmapStorageKey(userScope));
            if (saved) setCompletedTaskIds(JSON.parse(saved));
        } catch {
            // ignore
        }
    }, [state]);

    // Restore persisted resume analysis for authenticated user
    useEffect(() => {
        let isMounted = true;
        async function loadPersistedAnalysis() {
            try {
                const analyses = await base44.entities.ResumeAnalysis.list('-created_date', 1);
                if (isMounted && analyses && analyses.length > 0) {
                    const latest = analyses[0];
                    setResult((prev) => prev || latest);
                    setProfile((prev) => prev || latest);
                    if (latest.file_name) setFileName((prev) => prev || latest.file_name);
                    if (latest.file_url) setFileUrl((prev) => prev || latest.file_url);
                    if (latest.extracted_skills?.length) {
                        setConfirmedSkills((prev) => (prev.length ? prev : latest.extracted_skills));
                    }
                }
            } catch {
                // non-critical fallback
            }
        }
        loadPersistedAnalysis();
        return () => { isMounted = false; };
    }, []);

    // Compute or re-compute initial roadmap when targetRole or confirmedSkills change
    useEffect(() => {
        const skills = confirmedSkills.length ? confirmedSkills : (state?.last_resume_skills || []);
        const computed = buildRoadmapData({
            targetRole,
            userSkills: skills,
            resumeScore: result?.score || state?.resume_score || 70,
            confirmedSkills,
            customJobDesc: jobDesc
        });
        setRoadmapData(computed);
    }, [targetRole, confirmedSkills, result, state]);

    async function handleFile(file) {
        setError("");
        setResult(null);
        setRewarded(false);
        if (!file) return;
        if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
            setError("Please upload a valid PDF resume.");
            return;
        }
        setFileUrl("");
        setFileName(file.name);
        setUploading(true);
        try {
            const { file_url } = await base44.integrations.Core.UploadFile({ file });
            setFileUrl(file_url);
        } catch (e) {
            setError(e.message || "Upload failed — please try again.");
        } finally {
            setUploading(false);
        }
    }

    async function analyze() {
        if (!fileUrl) return;
        setAnalyzing(true);
        setError("");
        setResult(null);
        try {
            const res = await base44.functions.invoke("analyzeResume", {
                file_url: fileUrl,
                target_role: targetRole || state?.target_role || "Software Engineer"
            });
            const data = res?.data ?? res;
            if (data?.error) {
                setError(data.error);
                setAnalyzing(false);
                return;
            }
            const saved = await base44.entities.ResumeAnalysis.create({
                file_name: fileName,
                file_url: fileUrl,
                score: data.score,
                word_count: data.word_count,
                has_metrics: data.has_metrics,
                extracted_skills: data.extracted_skills,
                detected_sections: data.detected_sections,
                missing_sections: data.missing_sections,
                strengths: data.strengths,
                weaknesses: data.weaknesses,
                recommendations: data.recommendations
            });

            setError("");
            setResult(data);
            setProfile(data);
            if (data.extracted_skills?.length) {
                setConfirmedSkills(data.extracted_skills);
            }

            // Update user state & award initial resume scan reward
            if (state) {
                try {
                    const next = await setScores(state, {
                        resume_score: data.score,
                        last_resume_skills: data.extracted_skills || [],
                        target_role: targetRole
                    });
                    const fresh = await awardCoins(next, {
                        amount: 20,
                        xp: 30,
                        transaction_type: "REWARD_CLAIM",
                        description: "Resume Intelligence & Profile Parsing",
                        reference_id: `resume_${saved.id}`
                    });
                    if (fresh.coin_balance !== next.coin_balance) setRewarded(true);
                    await refresh();
                } catch {
                    // non-critical
                }
            }
        } catch (e) {
            setError(e.message || "Something went wrong analyzing your resume.");
        } finally {
            setAnalyzing(false);
        }
    }

    async function handleGenerateRoadmap() {
        setGeneratingRoadmap(true);
        setError("");
        try {
            // First build local baseline
            const baseRoadmap = buildRoadmapData({
                targetRole,
                userSkills: confirmedSkills,
                resumeScore: result?.score || state?.resume_score || 70,
                confirmedSkills,
                customJobDesc: jobDesc
            });

            // If job description is provided, query backend AI to compare specific requirements
            if (jobDesc.trim()) {
                const res = await base44.functions.invoke("generateRoadmap", {
                    target_role: targetRole,
                    job_description: jobDesc,
                    skills: confirmedSkills,
                    confirmed_skills: confirmedSkills,
                    resume_score: result?.score || state?.resume_score || 70
                });
                const aiData = res?.data ?? res;
                if (aiData?.requirement_breakdown?.length) {
                    baseRoadmap.requirement_breakdown = aiData.requirement_breakdown;
                    if (Number.isFinite(aiData.skill_match_score)) {
                        baseRoadmap.skill_match_score = aiData.skill_match_score;
                    }
                }
            }

            setRoadmapData(baseRoadmap);
            setActiveTab("readiness"); // switch to dashboard view
        } catch (err) {
            console.warn("Roadmap generation note:", err.message);
        } finally {
            setGeneratingRoadmap(false);
        }
    }

    async function handleToggleTask(taskId, xpReward = 15, taskText = "") {
        const userScope = state?.id || "guest";
        const isDone = completedTaskIds.includes(taskId);
        const updated = isDone
            ? completedTaskIds.filter((id) => id !== taskId)
            : [...completedTaskIds, taskId];

        setCompletedTaskIds(updated);
        try {
            localStorage.setItem(getRoadmapStorageKey(userScope), JSON.stringify(updated));
        } catch {
            // ignore
        }

        // Award reward if checking off
        if (!isDone && state) {
            try {
                const fresh = await awardCoins(state, {
                    amount: 5,
                    xp: xpReward,
                    transaction_type: "REWARD_CLAIM",
                    description: `Roadmap Milestone: ${taskText.slice(0, 40)}`,
                    reference_id: `task_${userScope}_${taskId}`
                });
                setTaskRewardNotice(`🎉 Milestone completed! +5 Coins, +${xpReward} XP awarded.`);
                setTimeout(() => setTaskRewardNotice(""), 4000);
                await refresh();
            } catch {
                // non-critical
            }
        }
    }

    const totalTasksCount = roadmapData?.stages?.reduce((acc, s) => acc + (s.tasks?.length || 0), 0) || 0;
    const scoreColor = result
        ? result.score >= 75 ? "#2F6B57" : result.score >= 55 ? "#C8922E" : "#A44732"
        : "#174A3A";

    return (
        <div className="space-y-6">
            <PageHeader
                eyebrow="Career Intelligence & Readiness"
                title="Job Readiness & Career Roadmap"
                subtitle="Analyze your resume, extract your profile, benchmark against target job requirements, and follow an actionable roadmap to get hired."
            />

            {rewarded && (
                <div className="p-3.5 rounded-md bg-[#E8F2EE] border border-[#B8DACD] text-[#174A3A] text-sm font-semibold flex items-center justify-between">
                    <span>🎉 Reward claimed: +20 Coins, +30 XP for Resume Intelligence Parsing!</span>
                    <button onClick={() => setRewarded(false)} className="text-xs hover:underline">Dismiss</button>
                </div>
            )}

            {taskRewardNotice && (
                <div className="p-3 rounded-md bg-[#FAF7F0] border border-[#C8922E] text-[#1C1C1A] text-xs font-semibold animate-pulse">
                    {taskRewardNotice}
                </div>
            )}

            {/* Navigation Tabs */}
            <div className="flex border-b border-[#D9D3C7] gap-2 overflow-x-auto pb-px">
                <button
                    onClick={() => setActiveTab("resume")}
                    className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === "resume"
                            ? "border-[#174A3A] text-[#174A3A] bg-white rounded-t-md"
                            : "border-transparent text-[#68665F] hover:text-[#174A3A]"
                    }`}
                >
                    📄 1. Resume & Profile Intelligence
                </button>
                <button
                    onClick={() => setActiveTab("readiness")}
                    className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === "readiness"
                            ? "border-[#174A3A] text-[#174A3A] bg-white rounded-t-md"
                            : "border-transparent text-[#68665F] hover:text-[#174A3A]"
                    }`}
                >
                    🎯 2. Job Readiness & Gap Analysis
                </button>
                <button
                    onClick={() => setActiveTab("roadmap")}
                    className={`px-4 py-2.5 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === "roadmap"
                            ? "border-[#174A3A] text-[#174A3A] bg-white rounded-t-md"
                            : "border-transparent text-[#68665F] hover:text-[#174A3A]"
                    }`}
                >
                    🗺️ 3. 7-Stage Career Roadmap & Learning Path
                </button>
            </div>

            {/* TAB 1: RESUME & PROFILE INTELLIGENCE */}
            {activeTab === "resume" && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        {/* Upload Panel */}
                        <div className="editorial-panel p-7 rounded-lg">
                            <p className="eyebrow mb-4">Upload Resume (PDF)</p>
                            <div
                                onClick={() => inputRef.current?.click()}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => {
                                    e.preventDefault();
                                    handleFile(e.dataTransfer.files?.[0]);
                                }}
                                className="border-2 border-dashed border-[#D9D3C7] rounded-md p-8 text-center cursor-pointer hover:border-[#174A3A] transition-colors bg-[#FAF7F0]/50"
                            >
                                <input
                                    ref={inputRef}
                                    type="file"
                                    accept="application/pdf"
                                    className="hidden"
                                    onChange={(e) => handleFile(e.target.files?.[0])}
                                />
                                <div className="text-3xl mb-2">
                                    {uploading ? <Spinner className="w-8 h-8 mx-auto" /> : "📄"}
                                </div>
                                {fileName ? (
                                    <div>
                                        <p className="text-sm font-semibold text-[#1C1C1A]">{fileName}</p>
                                        <p className="text-xs text-[#174A3A] mt-1 font-medium">✓ Ready for deep AI analysis</p>
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm font-semibold text-[#1C1C1A]">Drop your resume here or click to browse</p>
                                        <p className="text-xs text-[#68665F] mt-1">PDF only · max 8MB · Text-based format</p>
                                    </>
                                )}
                            </div>

                            {error && (
                                <div className="mt-4">
                                    <ErrorBanner message={error} onRetry={fileUrl ? analyze : undefined} />
                                </div>
                            )}

                            {fileUrl && !result && (
                                <div className="mt-5">
                                    <PrimaryButton loading={analyzing} onClick={analyze} disabled={!fileUrl || analyzing}>
                                        {analyzing ? "Extracting profile & scoring resume with AI…" : "Parse & Extract Career Profile"}
                                    </PrimaryButton>
                                </div>
                            )}
                        </div>

                        {/* Parsed Profile Editor & Confirmed Skills */}
                        <ProfileEditor
                            profile={profile || result}
                            confirmedSkills={confirmedSkills}
                            onUpdateConfirmedSkills={(updated) => setConfirmedSkills(updated)}
                            onUpdateProfile={(updatedProfile) => setProfile(updatedProfile)}
                        />

                        {/* Section Checklist */}
                        {result && (
                            <div className="editorial-panel p-6 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="eyebrow text-[#174A3A]">Detected Standard Resume Sections</p>
                                    <span className="text-xs text-[#68665F]">{result.word_count || 0} words parsed</span>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {ALL_SECTIONS.map((section) => {
                                        const present = (result.detected_sections || []).some(
                                            (s) => s.toLowerCase() === section.toLowerCase()
                                        );
                                        return (
                                            <div
                                                key={section}
                                                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs ${
                                                    present
                                                        ? "bg-[#E8F2EE] text-[#174A3A] font-semibold"
                                                        : "bg-[#FDF2F0] text-[#A44732] border border-[#F4D0C8]"
                                                }`}
                                            >
                                                <span>{present ? "✓" : "✕"}</span>
                                                <span>{section}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                                {result.missing_sections?.length > 0 && (
                                    <p className="text-xs text-[#68665F] mt-3">
                                        Missing optional/recommended sections: {result.missing_sections.join(", ")}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Sidebar: Score, Strengths, Recommendations */}
                    <div className="space-y-6">
                        <div className="editorial-card p-6 rounded-lg">
                            <p className="eyebrow mb-2">Resume Presentation Score</p>
                            <div className="flex items-baseline gap-1 mb-3">
                                <span className="text-5xl font-extrabold" style={{ color: scoreColor }}>
                                    {result ? Math.round(result.score) : (state?.resume_score || "—")}
                                </span>
                                <span className="text-xs text-[#68665F]">/100</span>
                            </div>
                            <ScoreBar value={result?.score || state?.resume_score || 0} color={scoreColor} className="h-2 rounded-full mb-3" />
                            <p className="text-xs text-[#68665F]">
                                {result?.has_metrics ? "✓ Quantified achievements & metrics detected" : "✕ Few or no quantified metrics found"}
                            </p>
                        </div>

                        {/* Move to Step 2 Callout */}
                        <div className="editorial-card p-5 rounded-lg border-l-4 border-l-[#174A3A] space-y-2">
                            <p className="eyebrow text-[#174A3A]">Next: Target Role Benchmarking</p>
                            <p className="text-xs text-[#68665F]">
                                Compare your extracted profile against the competencies of your desired job to discover gaps and receive your 7-stage roadmap.
                            </p>
                            <button
                                type="button"
                                onClick={() => setActiveTab("readiness")}
                                className="w-full mt-2 py-2 px-3 bg-[#174A3A] hover:bg-[#123A2D] text-white text-xs font-semibold rounded transition-colors"
                            >
                                Set Target Role & View Gaps →
                            </button>
                        </div>

                        {result?.strengths?.length > 0 && (
                            <div className="editorial-card p-5 rounded-lg">
                                <p className="eyebrow mb-3 text-[#2F6B57]">Key Profile Strengths</p>
                                <ul className="space-y-1.5">
                                    {result.strengths.map((s, i) => (
                                        <li key={i} className="text-xs text-[#1C1C1A] flex gap-2">
                                            <span className="text-[#2F6B57]">✓</span>
                                            <span>{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {result?.weaknesses?.length > 0 && (
                            <div className="editorial-card p-5 rounded-lg">
                                <p className="eyebrow mb-3 text-[#A44732]">Identified Weaknesses</p>
                                <ul className="space-y-1.5">
                                    {result.weaknesses.map((s, i) => (
                                        <li key={i} className="text-xs text-[#1C1C1A] flex gap-2">
                                            <span className="text-[#A44732]">✕</span>
                                            <span>{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {result?.recommendations?.length > 0 && (
                            <div className="editorial-card p-5 rounded-lg">
                                <p className="eyebrow mb-3 text-[#C8922E]">Actionable Recommendations</p>
                                <ul className="space-y-1.5">
                                    {result.recommendations.map((s, i) => (
                                        <li key={i} className="text-xs text-[#1C1C1A] flex gap-2">
                                            <span className="text-[#C8922E]">→</span>
                                            <span>{s}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* TAB 2: JOB READINESS & GAP ANALYSIS */}
            {activeTab === "readiness" && (
                <div className="space-y-6">
                    {/* Role Selector & Job Description input */}
                    <TargetJobSelector
                        selectedRole={targetRole}
                        onSelectRole={(r) => setTargetRole(r)}
                        jobDescription={jobDesc}
                        onChangeJobDescription={(d) => setJobDesc(d)}
                        onGenerateRoadmap={handleGenerateRoadmap}
                        loading={generatingRoadmap}
                    />

                    {/* Job Readiness Dashboard */}
                    {roadmapData && (
                        <JobReadinessDashboard
                            targetRole={targetRole}
                            readinessScore={roadmapData.readiness_score}
                            skillMatchScore={roadmapData.skill_match_score}
                            resumeScore={result?.score || state?.resume_score || 70}
                            completedTasksCount={completedTaskIds.length}
                            totalTasksCount={totalTasksCount}
                            requirementBreakdown={roadmapData.requirement_breakdown}
                            onNavigateToRoadmap={() => setActiveTab("roadmap")}
                        />
                    )}

                    {/* Requirement Gap Analysis */}
                    {roadmapData && (
                        <RequirementGapAnalysis
                            requirementBreakdown={roadmapData.requirement_breakdown}
                            targetRole={targetRole}
                        />
                    )}
                </div>
            )}

            {/* TAB 3: 7-STAGE CAREER ROADMAP & LEARNING PATH */}
            {activeTab === "roadmap" && (
                <div className="space-y-6">
                    {/* 7-Stage Interactive Roadmap with Checkboxes */}
                    {roadmapData && (
                        <InteractiveRoadmap
                            stages={roadmapData.stages}
                            completedTaskIds={completedTaskIds}
                            onToggleTask={handleToggleTask}
                            targetRole={targetRole}
                        />
                    )}

                    {/* Verified Learning Path: Real Certifications, Projects, Experience */}
                    {roadmapData && (
                        <VerifiedLearningPath
                            certifications={roadmapData.certifications}
                            project={roadmapData.project}
                            targetRole={targetRole}
                        />
                    )}
                </div>
            )}
        </div>
    );
}