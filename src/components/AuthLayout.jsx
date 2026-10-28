import React from "react";
import { Link } from "react-router-dom";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
            <div className="w-full max-w-md">
                <div className="text-center mb-6">
                    <Link to="/" className="inline-flex items-center gap-2.5 group" title="CareerCoach.ai Home">
                        <img
                            src="/career_coach_cc_logo.svg"
                            alt="Career Coach CC Logo"
                            className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                        <span className="font-semibold text-[#1C1C1A] text-base group-hover:text-[#174A3A] transition-colors">CareerCoach.ai</span>
                    </Link>
                </div>
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-3">
                        <Icon className="w-6 h-6 text-primary-foreground" aria-hidden="true" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
                    {subtitle && <p className="text-muted-foreground mt-1.5 text-sm">{subtitle}</p>}
                </div>
                <div className="bg-card rounded-2xl shadow-sm border border-border p-6 sm:p-8">
                    {children}
                </div>
                {footer && (
                    <p className="text-center text-sm text-muted-foreground mt-6">{footer}</p>
                )}
            </div>
        </div>
    );
}
