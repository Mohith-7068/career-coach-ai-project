import React from "react";

export default function ErrorBanner({ message, onRetry }) {
    if (!message) return null;
    return (
        <div className="p-3.5 rounded-md bg-[#FDF2F0] border border-[#F4D0C8] text-[#A44732] text-xs font-medium flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
                <span>⚠️</span>
                <span>{message}</span>
            </div>
            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="shrink-0 px-2.5 py-1 rounded bg-[#A44732] text-white text-[11px] font-semibold hover:bg-[#7B3328] transition-colors"
                >
                    Try again
                </button>
            )}
        </div>
    );
}