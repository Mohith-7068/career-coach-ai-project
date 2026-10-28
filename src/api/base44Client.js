/**
 * base44Client.js — Authenticated Hybrid Cloud & Local Persistence Client
 *
 * All career entities (CareerState, ResumeAnalysis, InterviewSession, SpeechSession,
 * CoinTransaction, RewardClaim) sync with MongoDB Atlas via authenticated REST APIs,
 * while maintaining responsive offline-safe localStorage cache.
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

function getStore(key) {
    try {
        return JSON.parse(localStorage.getItem(key) || 'null');
    } catch {
        return null;
    }
}

function setStore(key, value) {
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        /* storage quota exceeded or disabled */
    }
}

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function now() {
    return new Date().toISOString();
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8787";

function getAccessToken() {
    try {
        return localStorage.getItem('career_coach_token') || '';
    } catch {
        return '';
    }
}

export const ENTITY_CONFIG = {
    CareerState: 'cc_career_state',
    CoinTransaction: 'cc_coin_transaction',
    RewardClaim: 'cc_reward_claim',
    ResumeAnalysis: 'cc_resume_analysis',
    InterviewSession: 'cc_interview_session',
    SpeechSession: 'cc_speech_session',
    User: 'cc_user',
};

// ─── Cloud & Local Hybrid Entity Store Factory ──────────────────────────────

function makeEntityStore(storageKey, entityName) {
    function scopedKey() {
        let userId = 'guest';
        try {
            const user = JSON.parse(localStorage.getItem('career_coach_user') || 'null');
            if (user?.id) userId = String(user.id).replace(/[^a-zA-Z0-9_-]/g, '_');
        } catch { /* fall back to guest scope */ }
        return `${storageKey}:${userId}`;
    }

    function getAll() {
        return getStore(scopedKey()) || [];
    }

    function saveAll(rows) {
        setStore(scopedKey(), rows);
    }

    function mergeServerRows(serverRows) {
        if (!Array.isArray(serverRows)) return;
        const local = getAll();
        const map = new Map(local.map(r => [r.id, r]));
        for (const sr of serverRows) {
            const existing = map.get(sr.id);
            if (!existing) {
                map.set(sr.id, sr);
            } else {
                // Keep the newer one
                const localTime = new Date(existing.updated_date || existing.created_date || 0).getTime();
                const serverTime = new Date(sr.updated_date || sr.created_date || 0).getTime();
                map.set(sr.id, serverTime >= localTime ? sr : existing);
            }
        }
        saveAll(Array.from(map.values()));
    }

    return {
        async list(sortField = 'created_date', limit = 100) {
            const token = getAccessToken();
            if (token && entityName && entityName !== 'User') {
                try {
                    const queryParams = new URLSearchParams({ sort: sortField, limit: String(limit) });
                    const res = await fetch(`${API_BASE}/api/entities/${entityName}?${queryParams.toString()}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const serverRows = await res.json();
                        if (Array.isArray(serverRows)) {
                            mergeServerRows(serverRows);
                            return serverRows;
                        }
                    }
                } catch {
                    // Fall back to local storage if offline or server unavailable
                }
            }

            // Fallback to local storage
            let rows = getAll();
            const desc = sortField.startsWith('-');
            const field = desc ? sortField.slice(1) : sortField;
            rows = rows.sort((a, b) => {
                const av = a[field] || '';
                const bv = b[field] || '';
                return desc ? (bv > av ? 1 : -1) : (av > bv ? 1 : -1);
            });
            return rows.slice(0, limit);
        },

        async create(data) {
            const recordId = data.id || uid();
            const record = {
                id: recordId,
                created_date: data.created_date || now(),
                updated_date: data.updated_date || now(),
                ...data
            };

            // Save locally first for instant UI responsiveness and offline safety
            const rows = getAll();
            // Avoid duplicate ID in local array
            const existingIdx = rows.findIndex(r => r.id === recordId);
            if (existingIdx !== -1) {
                rows[existingIdx] = record;
            } else {
                rows.push(record);
            }
            saveAll(rows);

            const token = getAccessToken();
            if (token && entityName && entityName !== 'User') {
                try {
                    const res = await fetch(`${API_BASE}/api/entities/${entityName}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(record)
                    });
                    if (res.ok) {
                        const serverDoc = await res.json();
                        const updatedRows = getAll().map(r => r.id === recordId ? { ...r, ...serverDoc } : r);
                        saveAll(updatedRows);
                        return serverDoc;
                    }
                } catch {
                    // Offline condition: record is preserved in local storage and will sync later
                }
            }
            return record;
        },

        async update(id, patch) {
            // Optimistic update locally
            const rows = getAll();
            const idx = rows.findIndex(r => r.id === id);
            let updated = null;
            if (idx !== -1) {
                rows[idx] = { ...rows[idx], ...patch, updated_date: now() };
                saveAll(rows);
                updated = rows[idx];
            } else {
                updated = { id, ...patch, updated_date: now() };
                rows.push(updated);
                saveAll(rows);
            }

            const token = getAccessToken();
            if (token && entityName && entityName !== 'User') {
                try {
                    const res = await fetch(`${API_BASE}/api/entities/${entityName}/${id}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify(patch)
                    });
                    if (res.ok) {
                        const serverDoc = await res.json();
                        const finalRows = getAll().map(r => r.id === id ? { ...r, ...serverDoc } : r);
                        saveAll(finalRows);
                        return serverDoc;
                    }
                } catch {
                    // Offline condition: optimistic local update is preserved
                }
            }
            return updated;
        },

        async filter(query) {
            const token = getAccessToken();
            if (token && entityName && entityName !== 'User') {
                try {
                    const queryParams = new URLSearchParams(query);
                    const res = await fetch(`${API_BASE}/api/entities/${entityName}?${queryParams.toString()}`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    if (res.ok) {
                        const serverRows = await res.json();
                        if (Array.isArray(serverRows)) {
                            mergeServerRows(serverRows);
                            return serverRows;
                        }
                    }
                } catch {
                    // Fall back to local filter
                }
            }

            const rows = getAll();
            return rows.filter(row =>
                Object.entries(query).every(([k, v]) => row[k] === v)
            );
        },

        async delete(id) {
            const rows = getAll().filter(r => r.id !== id);
            saveAll(rows);

            const token = getAccessToken();
            if (token && entityName && entityName !== 'User') {
                try {
                    await fetch(`${API_BASE}/api/entities/${entityName}/${id}`, {
                        method: 'DELETE',
                        headers: { Authorization: `Bearer ${token}` }
                    });
                } catch {
                    // Handled
                }
            }
        }
    };
}

// ─── Non-destructive Background Sync to Cloud ───────────────────────────────

export async function syncLocalDataToCloud(targetUserId) {
    const token = getAccessToken();
    if (!token) return { success: false, reason: 'Unauthenticated' };
    const uidStr = targetUserId ? String(targetUserId).replace(/[^a-zA-Z0-9_-]/g, '_') : null;
    if (!uidStr) return { success: false, reason: 'No user ID' };

    const entityStores = {};
    let totalItems = 0;

    for (const [entityName, storageKey] of Object.entries(ENTITY_CONFIG)) {
        if (entityName === 'User') continue;
        const userRows = getStore(`${storageKey}:${uidStr}`) || [];
        const guestRows = getStore(`${storageKey}:guest`) || [];

        // Safely adopt guest records into user's local store
        if (guestRows.length > 0) {
            const combined = [...userRows];
            for (const gr of guestRows) {
                if (!combined.some(r => r.id === gr.id)) {
                    combined.push(gr);
                }
            }
            setStore(`${storageKey}:${uidStr}`, combined);
        }

        const allToSync = getStore(`${storageKey}:${uidStr}`) || [];
        if (allToSync.length > 0) {
            entityStores[entityName] = allToSync;
            totalItems += allToSync.length;
        }
    }

    if (totalItems === 0) {
        localStorage.setItem(`cc_synced_${uidStr}`, now());
        return { success: true, summary: { totalReceived: 0, migrated: 0, skipped: 0 } };
    }

    try {
        const response = await fetch(`${API_BASE}/api/sync/migrate-local`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ entityStores })
        });
        const resData = await response.json().catch(() => ({}));
        if (response.ok && resData.success) {
            localStorage.setItem(`cc_synced_${uidStr}`, now());
            // Clear temporary guest storage once successfully synced into user cloud account
            for (const storageKey of Object.values(ENTITY_CONFIG)) {
                try { localStorage.removeItem(`${storageKey}:guest`); } catch {}
            }
            return { success: true, summary: resData.summary };
        }
        return { success: false, error: resData.error || 'Migration failed' };
    } catch (err) {
        // Offline / network failure: keep local data untouched for future retry
        return { success: false, error: err.message };
    }
}

// ─── Live file upload ─────────────────────────────────────────────────────────

async function readApiResponse(response, fallbackMessage) {
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        if (response.status === 401 && /session has expired|account not found/i.test(data.error || '')) {
            try {
                localStorage.removeItem('career_coach_token');
                localStorage.removeItem('career_coach_user');
                localStorage.setItem('career_coach_auth', 'false');
            } catch {}
        }
        throw new Error(data.error || `${fallbackMessage} (HTTP ${response.status}).`);
    }
    if (!data || typeof data !== "object") {
        throw new Error(`${fallbackMessage}: the server returned an invalid response.`);
    }
    return data;
}

async function UploadFile({ file }) {
    if (!file) throw new Error("No file provided");
    const isAudio = file.type?.startsWith("audio/");
    const body = new FormData();
    body.append("file", file);
    const endpoint = isAudio ? "/api/speech/upload" : "/api/resume/upload";
    const token = getAccessToken();
    const headers = {};
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE}${endpoint}`, { method: "POST", headers, body });
    return readApiResponse(response, isAudio ? "Audio upload failed" : "Resume upload failed");
}

async function analyzeResumeLive(payload) {
    const token = getAccessToken();
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE}/api/resume/analyze`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
    });
    return readApiResponse(response, "Resume analysis failed");
}

async function invokeLiveAI(endpoint, payload) {
    const token = getAccessToken();
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE}${endpoint}`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload || {})
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
        if (response.status === 401 && /session has expired|account not found/i.test(data.error || '')) {
            try {
                localStorage.removeItem('career_coach_token');
                localStorage.removeItem('career_coach_user');
                localStorage.setItem('career_coach_auth', 'false');
            } catch {}
        }
        throw new Error(data.error || `AI request failed (${response.status})`);
    }
    return data;
}

async function analyzeSpeechLive(payload) {
    const token = getAccessToken();
    const headers = { "Content-Type": "application/json" };
    if (token) headers["Authorization"] = `Bearer ${token}`;
    const response = await fetch(`${API_BASE}/api/speech/analyze`, {
        method: "POST",
        headers,
        body: JSON.stringify(payload)
    });
    return readApiResponse(response, "Speech analysis failed");
}

// ─── API-backed authentication ───────────────────────────────────────────────

function saveAuth(result) {
    if (!result?.access_token || !result?.user) throw new Error('Authentication service returned an invalid response.');
    localStorage.setItem('career_coach_token', result.access_token);
    localStorage.setItem('career_coach_user', JSON.stringify(result.user));
    localStorage.setItem('career_coach_auth', 'true');
    // Autonomous safe background sync from localStorage to Atlas
    syncLocalDataToCloud(result.user.id).catch(() => {});
    return result;
}

async function authRequest(path, payload = {}, method = 'POST') {
    const response = await fetch(`${API_BASE}${path}`, {
        method,
        headers: {
            ...(method !== 'GET' ? { 'Content-Type': 'application/json' } : {}),
            ...(getAccessToken() ? { Authorization: `Bearer ${getAccessToken()}` } : {})
        },
        ...(method !== 'GET' ? { body: JSON.stringify(payload) } : {})
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `Authentication request failed (${response.status}).`);
    return data;
}

const auth = {
    async me() {
        const token = getAccessToken();
        if (!token) throw new Error('Unauthenticated');
        try {
            const result = await authRequest('/api/auth/me', {}, 'GET');
            localStorage.setItem('career_coach_user', JSON.stringify(result.user));
            localStorage.setItem('career_coach_auth', 'true');
            // Background sync existing browser data on session load
            syncLocalDataToCloud(result.user.id).catch(() => {});
            return result.user;
        } catch (error) {
            if (/session has expired|account not found|unauthorized|unauthenticated/i.test(error.message)) {
                localStorage.removeItem('career_coach_token');
                localStorage.removeItem('career_coach_user');
                localStorage.setItem('career_coach_auth', 'false');
            }
            throw error;
        }
    },
    async logout(redirectUrl) {
        try { if (getAccessToken()) await authRequest('/api/auth/logout'); } catch { /* clear local session even if offline */ }
        localStorage.removeItem('career_coach_token');
        localStorage.removeItem('career_coach_user');
        localStorage.setItem('career_coach_auth', 'false');
        if (redirectUrl) window.location.href = redirectUrl;
    },
    redirectToLogin(returnUrl) {
        const target = returnUrl || `${window.location.pathname}${window.location.search}`;
        window.location.href = `/login${target && target !== '/' ? `?returnTo=${encodeURIComponent(target)}` : ''}`;
    },
    async loginViaEmailPassword(email, password) {
        const result = await authRequest('/api/auth/login', { email, password });
        return saveAuth(result);
    },
    loginWithProvider(provider, returnTo) {
        if (provider === 'google') throw new Error('Google sign-in is not configured yet. Use email and password for now.');
        throw new Error(`Sign-in provider "${provider}" is not supported.`);
    },
    async resetPasswordRequest() {
        throw new Error('Password reset email is not configured yet. Please contact the administrator to reset your password.');
    },
    async resetPassword() {
        throw new Error('Password reset is not configured yet. Please contact the administrator.');
    },
    async register({ email, password, full_name }) {
        const result = await authRequest('/api/auth/register', { email, password, full_name });
        return saveAuth(result);
    },
    async verifyOtp() {
        throw new Error('Email OTP verification is not configured. Registration currently uses email and password without email verification.');
    },
    setToken(token) {
        if (token) localStorage.setItem('career_coach_token', token);
    },
    async resendOtp() {
        throw new Error('Email verification is not configured yet.');
    }
};

// ─── Assemble the base44 client object ───────────────────────────────────────

export const base44 = {
    auth,

    entities: {
        CareerState: makeEntityStore('cc_career_state', 'CareerState'),
        CoinTransaction: makeEntityStore('cc_coin_transaction', 'CoinTransaction'),
        RewardClaim: makeEntityStore('cc_reward_claim', 'RewardClaim'),
        ResumeAnalysis: makeEntityStore('cc_resume_analysis', 'ResumeAnalysis'),
        InterviewSession: makeEntityStore('cc_interview_session', 'InterviewSession'),
        SpeechSession: makeEntityStore('cc_speech_session', 'SpeechSession'),
        User: makeEntityStore('cc_user', 'User')
    },

    syncLocalDataToCloud,

    functions: {
        async invoke(fnName, payload) {
            if (fnName === "analyzeResume") return analyzeResumeLive(payload);
            if (fnName === "analyzeSpeech") return analyzeSpeechLive(payload);
            if (fnName === "interviewQuestions") return invokeLiveAI("/api/ai/interview-questions", payload);
            if (fnName === "evaluateAnswer") return invokeLiveAI("/api/ai/evaluate-answer", payload);
            if (fnName === "matchJob") return invokeLiveAI("/api/ai/match-job", payload);
            if (fnName === "generateRoadmap") return invokeLiveAI("/api/career/roadmap", payload);
            throw new Error(`AI function "${fnName}" is not connected to a live backend yet. No demo result was generated.`);
        }
    },

    integrations: {
        Core: { UploadFile }
    }
};
