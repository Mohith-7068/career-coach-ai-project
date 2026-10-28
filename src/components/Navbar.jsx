import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import StreakDropdown from "@/components/StreakDropdown";

const NAV_LINKS = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/resume", label: "Resume" },
    { to: "/communication", label: "Communication" },
    { to: "/interview", label: "Interview Studio" },
    { to: "/rewards", label: "Rewards" }
];

export default function Navbar({ state }) {
    const location = useLocation();
    const { isAuthenticated, login, logout } = useAuth();

    const isDemo = location.pathname === '/demo';
    // When on /demo, show demo values (245, 6). When logged in, show user state. When guest/logged-out, show 0.
    const coins = isDemo ? 245 : (isAuthenticated ? (state?.coin_balance ?? 0) : 0);
    const streak = isDemo ? 6 : (isAuthenticated ? (state?.streak_days ?? 0) : 0);
    const longestStreak = isDemo ? 10 : (isAuthenticated ? (state?.longest_streak ?? 0) : 0);
    const activeDays = isDemo ? ["MON", "TUE", "WED", "THU", "FRI", "SAT"] : (isAuthenticated ? (state?.active_days ?? []) : []);

    return (
        <header className="sticky top-0 z-50 bg-white border-b border-[#D9D3C7] shadow-sm h-16">
            <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-4">
                <Link to="/" className="flex items-center gap-2.5 shrink-0" title="CareerCoach.ai Home">
                    <img
                        src="/career_coach_cc_logo.svg"
                        alt="Career Coach CC Logo"
                        className="h-8 w-auto object-contain"
                    />
                    <span className="font-semibold text-[#1C1C1A] text-sm hidden sm:inline">CareerCoach.ai</span>
                </Link>

                <nav className="hidden lg:flex items-center gap-1">
                    {NAV_LINKS.map((link) => {
                        const active = location.pathname === link.to;
                        return (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${active
                                        ? "text-[#174A3A] bg-[#E8F2EE]"
                                        : "text-[#68665F] hover:text-[#174A3A] hover:bg-[#FAF7F0]"
                                    }`}
                            >
                                {link.label}
                            </Link>
                        );
                    })}
                    <Link
                        to="/demo"
                        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${location.pathname === '/demo'
                                ? "text-[#174A3A] bg-[#E8F2EE]"
                                : "text-[#68665F] hover:text-[#174A3A] hover:bg-[#FAF7F0]"
                            }`}
                    >
                        Demo
                    </Link>
                    <Link
                        to="/premium"
                        className="ml-1 px-3 py-1.5 rounded-md text-sm font-semibold text-[#174A3A] hover:bg-[#E8F2EE]"
                    >
                        Premium
                    </Link>
                </nav>

                <div className="flex items-center gap-2 shrink-0">
                    {/* Collapsed clickable Coin Wallet badge */}
                    <Link
                        to="/wallet"
                        className="badge-coin inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold hover:shadow-sm hover:scale-[1.02] transition-all"
                        title="Career Coin Wallet — Click to view ledger & redeem rewards"
                    >
                        <span>🪙</span>
                        <span>{coins}</span>
                    </Link>

                    {/* Interactive Streak dropdown popover */}
                    <StreakDropdown
                        streak={streak}
                        longestStreak={longestStreak}
                        activeDays={activeDays}
                        isDemo={isDemo}
                    />

                    {isAuthenticated ? (
                        <button
                            onClick={() => logout()}
                            className="px-3 py-1.5 rounded-md text-sm font-medium text-[#68665F] hover:text-[#A44732] hover:bg-[#FAF7F0] transition-colors hidden sm:inline-flex"
                        >
                            Log out
                        </button>
                    ) : (
                        <Link
                            to={`/login${location.pathname && location.pathname !== '/' ? `?returnTo=${encodeURIComponent(location.pathname + location.search)}` : ''}`}
                            className="px-3 py-1.5 rounded-md text-sm font-medium text-[#68665F] hover:text-[#174A3A] hover:bg-[#FAF7F0] transition-colors inline-flex items-center"
                        >
                            Log in
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}