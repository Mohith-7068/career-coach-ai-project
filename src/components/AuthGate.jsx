import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function AuthGate({ title, description, children }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();
    const currentPath = `${location.pathname}${location.search}`;
    const loginUrl = `/login${currentPath && currentPath !== '/' ? `?returnTo=${encodeURIComponent(currentPath)}` : ''}`;

    if (isAuthenticated) {
        return children;
    }

    return (
        <div className="py-12 flex flex-col items-center justify-center">
            <div className="w-full max-w-lg editorial-panel p-8 sm:p-10 rounded-lg text-center shadow-sm">
                <div className="w-12 h-12 rounded-full bg-[#E8F2EE] text-[#174A3A] flex items-center justify-center mx-auto mb-5 text-xl">
                    🔒
                </div>
                <p className="eyebrow mb-2">Member Access Required</p>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#1C1C1A] mb-3">
                    {title}
                </h1>
                <p className="text-sm text-[#68665F] leading-relaxed mb-8 max-w-md mx-auto">
                    {description}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <Link
                        to={loginUrl}
                        className="btn-primary w-full sm:w-auto px-6 py-3 font-semibold rounded-md text-sm shadow-sm text-center inline-block"
                    >
                        Log in to access →
                    </Link>
                    <Link
                        to="/demo"
                        className="w-full sm:w-auto px-6 py-3 font-semibold rounded-md text-sm border border-[#D9D3C7] text-[#1C1C1A] hover:border-[#174A3A] hover:text-[#174A3A] transition-colors text-center"
                    >
                        Explore Demo Mode
                    </Link>
                </div>
            </div>
        </div>
    );
}
