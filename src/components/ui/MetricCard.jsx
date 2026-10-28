import React from "react";

export default function MetricCard({ label, value, hint }) {
    return (
        <div className="editorial-card p-5 rounded-md">
            <p className="eyebrow mb-2">{label}</p>
            <p className="text-2xl font-bold text-[#1C1C1A] tracking-tight">{value}</p>
            {hint && <p className="mt-1 text-[11px] text-[#68665F]">{hint}</p>}
        </div>
    );
}