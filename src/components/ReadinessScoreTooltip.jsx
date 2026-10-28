import React, { useState, useRef, useEffect } from "react";

/**
 * ReadinessScoreTooltip — Displays a subtle info icon (ⓘ) beside the Career Readiness Score
 * label, with a non-blocking, accessible popover explaining the exact 30/30/20/20 weighting
 * formula defined in careerData.js.
 */
export default function ReadinessScoreTooltip() {
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setOpen(false);
            }
        }
        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
            document.addEventListener("touchstart", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("touchstart", handleClickOutside);
        };
    }, [open]);

    return (
        <span
            ref={containerRef}
            className="relative inline-flex items-center align-middle ml-1.5"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
        >
            <button
                type="button"
                onClick={() => setOpen((prev) => !prev)}
                className="w-4 h-4 rounded-full flex items-center justify-center text-[11px] font-semibold text-[#68665F] hover:text-[#174A3A] bg-[#FAF7F0] hover:bg-[#E8F2EE] border border-[#D9D3C7] hover:border-[#B8DACD] transition-colors focus:outline-none focus:ring-1 focus:ring-[#174A3A]"
                aria-label="How Career Readiness Score is calculated"
                aria-expanded={open}
            >
                ⓘ
            </button>

            {open && (
                <div
                    role="tooltip"
                    className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 bottom-full mb-2 z-50 w-72 p-4 bg-white border border-[#D9D3C7] rounded-lg shadow-lg text-left animate-in fade-in zoom-in-95 duration-150"
                >
                    <p className="text-xs font-bold text-[#1C1C1A] mb-1">
                        Readiness Score Breakdown
                    </p>
                    <p className="text-[11px] text-[#68665F] leading-relaxed mb-3">
                        Calculated as a weighted composite of your four studio performance metrics:
                    </p>

                    <div className="space-y-1.5 text-xs">
                        <div className="flex items-center justify-between py-1 border-b border-[#FAF7F0]">
                            <span className="font-medium text-[#1C1C1A]">📄 Resume Quality</span>
                            <span className="font-bold text-[#174A3A]">30%</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-[#FAF7F0]">
                            <span className="font-medium text-[#1C1C1A]">🎙️ Communication Delivery</span>
                            <span className="font-bold text-[#174A3A]">30%</span>
                        </div>
                        <div className="flex items-center justify-between py-1 border-b border-[#FAF7F0]">
                            <span className="font-medium text-[#1C1C1A]">💬 Interview (STAR)</span>
                            <span className="font-bold text-[#174A3A]">20%</span>
                        </div>
                        <div className="flex items-center justify-between py-1">
                            <span className="font-medium text-[#1C1C1A]">⚡ Technical Assessment</span>
                            <span className="font-bold text-[#174A3A]">20%</span>
                        </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-[#E5E0D5] text-[10px] text-[#68665F]">
                        Practise in any studio to automatically update its sub-score and lift your overall score.
                    </div>
                </div>
            )}
        </span>
    );
}
