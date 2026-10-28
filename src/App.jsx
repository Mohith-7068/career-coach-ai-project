import React from 'react';
import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import ScrollToTop from './components/ScrollToTop';
import Layout from '@/components/Layout';
import AuthGate from '@/components/AuthGate';
import Home from '@/pages/Home';
import Dashboard from '@/pages/Dashboard';
import Resume from '@/pages/Resume';
import Communication from '@/pages/Communication';
import Interview from '@/pages/Interview';
import Rewards from '@/pages/Rewards';
import Wallet from '@/pages/Wallet';
import Premium from '@/pages/Premium';
import Demo from '@/pages/Demo';
import About from '@/pages/About';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import ForgotPassword from '@/pages/ForgotPassword';
import ResetPassword from '@/pages/ResetPassword';
import OAuthConsent from '@/pages/OAuthConsent';

const AuthenticatedApp = () => {
    const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

    // Show loading spinner while checking app public settings or auth
    if (isLoadingPublicSettings || isLoadingAuth) {
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
            </div>
        );
    }

    // Handle authentication errors
    if (authError) {
        if (authError.type === 'user_not_registered') {
            return <UserNotRegisteredError />;
        } else if (authError.type === 'auth_required') {
            navigateToLogin();
            return null;
        }
    }

    // Render the main app
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route
                    path="/dashboard"
                    element={
                        <AuthGate
                            title="Career Progression Studio"
                            description="Track your career readiness score, level progression, activity streaks, and daily practice missions."
                        >
                            <Dashboard />
                        </AuthGate>
                    }
                />
                <Route
                    path="/resume"
                    element={
                        <AuthGate
                            title="Resume Intelligence Studio"
                            description="Upload and analyze your resume with AI skill extraction, ATS metric breakdown, and targeted job description matching."
                        >
                            <Resume />
                        </AuthGate>
                    }
                />
                <Route
                    path="/communication"
                    element={
                        <AuthGate
                            title="Communication Practice Coach"
                            description="Record your spoken answer to practice pacing, clarity, and filler-word reduction with instant feedback."
                        >
                            <Communication />
                        </AuthGate>
                    }
                />
                <Route
                    path="/interview"
                    element={
                        <AuthGate
                            title="AI Mock Interview Studio"
                            description="Practice resume-grounded mock interviews with instant STAR structure evaluation and deep session reviews."
                        >
                            <Interview />
                        </AuthGate>
                    }
                />
                <Route
                    path="/rewards"
                    element={
                        <AuthGate
                            title="Career Rewards Hub"
                            description="Complete daily missions and structured practice challenges to earn Career Coins."
                        >
                            <Rewards />
                        </AuthGate>
                    }
                />
                <Route
                    path="/wallet"
                    element={
                        <AuthGate
                            title="Career Coin Wallet"
                            description="Manage your Career Coins, view transaction logs, and redeem rewards or unlock premium features."
                        >
                            <Wallet />
                        </AuthGate>
                    }
                />
                <Route
                    path="/premium"
                    element={
                        <AuthGate
                            title="CareerCoach Premium"
                            description="Unlock advanced AI reviews, unlimited daily challenges, and custom interview tracks."
                        >
                            <Premium />
                        </AuthGate>
                    }
                />
                <Route path="/demo" element={<Demo />} />
                <Route path="/about" element={<About />} />
            </Route>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/oauth/consent" element={<OAuthConsent />} />
            <Route path="/oauth-consent" element={<OAuthConsent />} />
            <Route path="*" element={<PageNotFound />} />
        </Routes>
    );
};

function App() {
    return (
        <AuthProvider>
            <QueryClientProvider client={queryClientInstance}>
                <Router>
                    <ScrollToTop />
                    <AuthenticatedApp />
                </Router>
                <Toaster />
            </QueryClientProvider>
        </AuthProvider>
    );
}

export default App;