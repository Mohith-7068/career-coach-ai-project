import React, { useEffect, useRef } from "react";
import useLiveTranscript from "@/hooks/useLiveTranscript";
import PrimaryButton from "@/components/ui/PrimaryButton";

// Microphone interview answer capture: live transcription while speaking,
// then the complete transcript is submitted as the answer.
export default function MicCapture({ submitted, onSubmit, evaluating }) {
    const { supported, listening, liveText, finalText, start, stop } = useLiveTranscript();
    const speechStartAtRef = useRef(0);

    const handleStart = () => {
        speechStartAtRef.current = performance.now();
        start();
    };

    useEffect(() => {
        if (submitted) stop();
    }, [submitted, stop]);

    if (!supported) {
        return (
            <p className="text-sm text-[#A44732] bg-[#FDF2F0] border border-[#E8C3BD] rounded-md p-3">
                Live speech recognition isn't available in this browser. Use Chrome on desktop/Android,
                or switch to Standard mode to type your answers.
            </p>
        );
    }

    const answerText = (finalText || liveText).trim();

    const handleSubmit = () => {
        const duration = speechStartAtRef.current
            ? Math.max(1, Math.round((performance.now() - speechStartAtRef.current) / 1000))
            : 0;
        const speechAnalysis = answerText ? {
            duration_seconds: duration,
            spoken: true
        } : null;
        onSubmit(answerText, null, speechAnalysis);
    };

    return (
        <div>
            <div className="flex items-center gap-3 mb-3">
                <button
                    type="button"
                    onClick={listening ? stop : handleStart}
                    disabled={submitted}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${listening
                            ? "bg-[#A44732] text-white"
                            : "bg-[#174A3A] text-white hover:bg-[#123B2E] disabled:opacity-50"
                        }`}
                >
                    {listening ? "⏹ Stop" : "🎙 Start Speaking"}
                </button>
                {listening && (
                    <span className="text-xs text-[#C8922E] flex items-center gap-1.5 font-medium">
                        <span className="w-2 h-2 rounded-full bg-[#C8922E] animate-pulse" />
                        Listening…
                    </span>
                )}
            </div>

            <div className="min-h-40 p-4 rounded-md bg-[#FAF7F0] border border-[#E5E0D5] text-sm text-[#1C1C1A] leading-relaxed">
                {liveText || (
                    <span className="text-[#68665F]">
                        Your live transcript will appear here as you speak…
                    </span>
                )}
            </div>

            {!submitted && (
                <div className="mt-3">
                    <PrimaryButton
                        loading={evaluating}
                        onClick={handleSubmit}
                        disabled={!answerText || evaluating}
                    >
                        {evaluating ? "Evaluating…" : "Submit Answer"}
                    </PrimaryButton>
                </div>
            )}
        </div>
    );
}