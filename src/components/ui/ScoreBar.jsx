import React from "react";

export default function ScoreBar({ value = 0, color = "#174A3A" }) {
    return (
        <div className="w-full h-1.5 rounded-full bg-[#E5E0D5] overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${Math.max(0, Math.min(100, value))}%`, backgroundColor: color }}
            />
        </div>
    );
}