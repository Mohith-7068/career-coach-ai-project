import React from "react";
import ScoreBar from "@/components/ui/ScoreBar";

export default function InteractiveRoadmap({
    stages = [],
    completedTaskIds = [],
    onToggleTask,
    targetRole
}) {
    const totalTasks = stages.reduce((acc, s) => acc + (s.tasks?.length || 0), 0);
    const completedCount = completedTaskIds.length;
    const overallPct = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;

    return (
        <div className="editorial-panel p-6 rounded-lg space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                    <p className="eyebrow text-[#174A3A]">7-Stage Step-by-Step Career Roadmap</p>
                    <p className="text-xs text-[#68665F]">
                        Sequential preparation milestones to reach job-application readiness for {targetRole}. Check off tasks as you finish them.
                    </p>
                </div>
                <div className="text-right shrink-0">
                    <span className="text-sm font-bold text-[#174A3A]">
                        {completedCount} of {totalTasks} Tasks Completed
                    </span>
                    <span className="text-xs text-[#68665F] block">({overallPct}% Progress)</span>
                </div>
            </div>

            <ScoreBar value={overallPct} color="#174A3A" className="h-2 rounded-full" />

            {/* Stages List */}
            <div className="space-y-4 pt-2">
                {stages.map((stg) => {
                    const stgTotal = stg.tasks?.length || 0;
                    const stgCompleted = (stg.tasks || []).filter(t => completedTaskIds.includes(t.id)).length;
                    const stgPct = stgTotal > 0 ? Math.round((stgCompleted / stgTotal) * 100) : 0;
                    const isAllDone = stgTotal > 0 && stgCompleted === stgTotal;

                    return (
                        <div
                            key={stg.stage}
                            className={`p-5 rounded-lg border transition-all ${
                                isAllDone
                                    ? "bg-[#E8F2EE]/30 border-[#B8DACD]"
                                    : "bg-white border-[#E5E0D5]"
                            }`}
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2">
                                    <span
                                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                            isAllDone
                                                ? "bg-[#2F6B57] text-white"
                                                : "bg-[#174A3A] text-white"
                                        }`}
                                    >
                                        {isAllDone ? "✓" : stg.stage}
                                    </span>
                                    <h4 className="font-bold text-sm text-[#1C1C1A]">
                                        Stage {stg.stage}: {stg.title}
                                    </h4>
                                </div>

                                <div className="flex items-center gap-3 text-xs text-[#68665F] self-start sm:self-auto">
                                    <span className="bg-[#FAF7F0] px-2 py-0.5 rounded border border-[#E5E0D5]">
                                        Effort: {stg.estimated_effort}
                                    </span>
                                    <span className="font-semibold text-[#174A3A]">
                                        {stgCompleted}/{stgTotal} done
                                    </span>
                                </div>
                            </div>

                            <p className="text-xs text-[#68665F] mb-3 ml-8">
                                <span className="font-medium text-[#1C1C1A]">Objective: </span>
                                {stg.objective}
                            </p>

                            {/* Task Checklist */}
                            <div className="ml-8 space-y-2 pt-2 border-t border-[#F3EFE6]">
                                {(stg.tasks || []).map((task) => {
                                    const isDone = completedTaskIds.includes(task.id);
                                    return (
                                        <label
                                            key={task.id}
                                            className={`flex items-start gap-2.5 p-2 rounded cursor-pointer transition-colors ${
                                                isDone ? "bg-[#FAF7F0]/60 line-through text-[#68665F]" : "hover:bg-[#FAF7F0] text-[#1C1C1A]"
                                            }`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={isDone}
                                                onChange={() => onToggleTask(task.id, task.xp_reward || 15, task.text)}
                                                className="mt-0.5 h-4 w-4 rounded border-[#D9D3C7] text-[#174A3A] focus:ring-[#174A3A]"
                                            />
                                            <div className="flex-1 text-xs leading-normal">
                                                <span>{task.text}</span>
                                                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#68665F]">
                                                    <span>Estimated: {task.estimated_days}</span>
                                                    <span>·</span>
                                                    <span className="text-[#C8922E] font-medium">+{task.xp_reward || 15} XP</span>
                                                </div>
                                            </div>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
