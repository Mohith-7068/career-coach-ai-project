import React from "react";

export default function Spinner({ className = "w-4 h-4", color = "#174A3A" }) {
    return (
        <span
            className={`inline-block rounded-full border-2 border-t-transparent animate-spin ${className}`}
            style={{ borderColor: color, borderTopColor: "transparent" }}
        />
    );
}