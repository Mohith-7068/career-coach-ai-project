import React from "react";
import { Link, Outlet } from "react-router-dom";
import Navbar from "@/components/Navbar";
import useCareerState from "@/lib/useCareerState";

export default function Layout() {
    const { state, refresh } = useCareerState();

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar state={state} />
            <main className="flex-1">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
                    <Outlet context={{ state, refresh }} />
                </div>
            </main>
            <footer className="border-t border-[#D9D3C7] bg-[#FAF7F0] py-6 text-center text-xs text-[#68665F] flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4">
                <span>CareerCoach.ai — AI-Powered Career Readiness Coach</span>
                <span className="hidden sm:inline text-[#D9D3C7]">·</span>
                <Link to="/about" className="font-semibold text-[#174A3A] hover:underline">
                    How it works
                </Link>
            </footer>
        </div>
    );
}