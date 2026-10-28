import React from "react";
import ScoreBar from "@/components/ui/ScoreBar";

export default function ScoreCard({ label, score, suffix = "/100" }) {
    const color = score >= 75 ? "#2F6B57" : score >= 55 ? "#C8922E" : "#A44732";
    return (
        <div className="editorial-card p-6 rounded-md">
            <p className="eyebrow mb-3">{label}</p>
            <div className="flex items-baseline gap-1 mb-3">
                <span className="text-4xl font-bold tracking-tight" style={{ color }}>
                    {Math.round(score)}
                </span>
                <span className="text-xs text-[#68665F] font-medium">{suffix}</span>
            </div>
            <ScoreBar value={score} color={color} />
        </div>
    );
}