import React from "react";

export default function PageHeader({ eyebrow, title, subtitle, children }) {
    return (
        <div className="border-b border-[#D9D3C7] pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
                {eyebrow && <p className="eyebrow mb-2">{eyebrow}</p>}
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#1C1C1A]">{title}</h1>
                {subtitle && <p className="mt-2 text-sm text-[#68665F] max-w-2xl leading-relaxed">{subtitle}</p>}
            </div>
            {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
        </div>
    );
}