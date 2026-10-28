import React from "react";
import Spinner from "@/components/ui/Spinner";

export default function PrimaryButton({ children, loading, disabled, className = "", ...props }) {
    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={`btn-primary w-full py-3.5 font-semibold rounded-md text-sm shadow-sm flex items-center justify-center gap-2 ${className}`}
        >
            {loading && <Spinner className="w-4 h-4" color="#FFFFFF" />}
            {children}
        </button>
    );
}