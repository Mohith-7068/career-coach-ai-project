import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const initialToken = typeof window !== 'undefined' ? localStorage.getItem('career_coach_token') : null;
    const initialUser = typeof window !== 'undefined' ? (() => {
        try {
            return JSON.parse(localStorage.getItem('career_coach_user') || 'null');
        } catch {
            return null;
        }
    })() : null;

    const [isAuthenticated, setIsAuthenticated] = useState(Boolean(initialToken && initialUser));
    const [user, setUser] = useState(initialUser);
    const [isLoadingAuth, setIsLoadingAuth] = useState(Boolean(initialToken && !initialUser));
    const [isLoadingPublicSettings] = useState(false);
    const [authError, setAuthError] = useState(null);
    const [authChecked, setAuthChecked] = useState(Boolean(initialToken && initialUser));
    const [appPublicSettings] = useState({ id: 'career-coach-local', public_settings: {} });

    const checkUserAuth = useCallback(async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('career_coach_token') : null;
        if (!token) {
            setUser(null);
            setIsAuthenticated(false);
            setAuthError(null);
            setIsLoadingAuth(false);
            setAuthChecked(true);
            return null;
        }

        try {
            const currentUser = await base44.auth.me();
            setUser(currentUser);
            setIsAuthenticated(true);
            setAuthError(null);
            return currentUser;
        } catch (err) {
            if (/session has expired|account not found|unauthorized|unauthenticated/i.test(err?.message || '')) {
                try {
                    localStorage.removeItem('career_coach_token');
                    localStorage.removeItem('career_coach_user');
                    localStorage.setItem('career_coach_auth', 'false');
                } catch {}
                setUser(null);
                setIsAuthenticated(false);
                setAuthError(null);
            }
            return null;
        } finally {
            setIsLoadingAuth(false);
            setAuthChecked(true);
        }
    }, []);

    useEffect(() => {
        checkUserAuth();

        const handleStorage = (e) => {
            if (e.key === 'career_coach_token' || e.key === 'career_coach_user') {
                checkUserAuth();
            }
        };
        window.addEventListener('storage', handleStorage);
        return () => window.removeEventListener('storage', handleStorage);
    }, [checkUserAuth]);

    const login = (returnTo) => {
        const target = (typeof returnTo === 'string' && returnTo)
            ? returnTo
            : (typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/');
        const query = target && target !== '/' ? `?returnTo=${encodeURIComponent(target)}` : '';
        window.location.href = `/login${query}`;
    };
    const logout = async () => {
        await base44.auth.logout();
        setUser(null);
        setIsAuthenticated(false);
        setAuthError(null);
        window.location.href = '/';
    };
    const navigateToLogin = (returnTo) => {
        const target = (typeof returnTo === 'string' && returnTo)
            ? returnTo
            : (typeof window !== 'undefined' ? `${window.location.pathname}${window.location.search}` : '/');
        const query = target && target !== '/' ? `?returnTo=${encodeURIComponent(target)}` : '';
        window.location.href = `/login${query}`;
    };
    const checkAppState = async () => {};

    return (
        <AuthContext.Provider value={{
            user, isAuthenticated, isLoadingAuth, isLoadingPublicSettings, authError,
            appPublicSettings, authChecked, login, logout, navigateToLogin,
            checkUserAuth, checkAppState
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within an AuthProvider');
    return context;
};
