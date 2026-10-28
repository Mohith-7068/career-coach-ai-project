/**
 * careerState.js — Hybrid Cloud-Persisted & Local Career State Management.
 *
 * All mutations sync with MongoDB Atlas via base44.entities while providing
 * zero-latency local optimistic updates and dispatching 'career-state-updated'
 * events so that UI components respond instantly.
 */

import { base44 } from '@/api/base44Client';

const STATE_KEY = 'cc_career_state';
const TXN_KEY = 'cc_coin_transaction';

function currentUserScope() {
    try {
        const user = JSON.parse(localStorage.getItem('career_coach_user') || 'null');
        return user?.id ? String(user.id).replace(/[^a-zA-Z0-9_-]/g, '_') : 'guest';
    } catch {
        return 'guest';
    }
}

function scopedKey(base) {
    return `${base}:${currentUserScope()}`;
}

function uid() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

function now() {
    return new Date().toISOString();
}

const DAY_CODES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

function getTodayInfo() {
    const d = new Date();
    const todayStr = d.toISOString().slice(0, 10);
    const dayCode = DAY_CODES[d.getDay()];

    const y = new Date(d);
    y.setDate(y.getDate() - 1);
    const yesterdayStr = y.toISOString().slice(0, 10);

    return { todayStr, dayCode, yesterdayStr };
}

const DEFAULTS = {
    target_role: "Software Engineer",
    experience_level: "entry",
    coin_balance: 0,
    lifetime_earned: 0,
    lifetime_spent: 0,
    xp: 0,
    streak_days: 0,
    longest_streak: 0,
    active_days: [],
    coins_today: 0,
    last_active_date: null,
    plan: "FREE",
    plan_acquisition: "FREE",
    resume_score: 0,
    communication_score: 0,
    technical_score: 0,
    interview_score: 0,
    last_resume_skills: []
};

function getStates() {
    try { return JSON.parse(localStorage.getItem(scopedKey(STATE_KEY)) || '[]'); } catch { return []; }
}
function saveStates(rows) {
    try { localStorage.setItem(scopedKey(STATE_KEY), JSON.stringify(rows)); } catch {}
}

function getTxns() {
    try { return JSON.parse(localStorage.getItem(scopedKey(TXN_KEY)) || '[]'); } catch { return []; }
}
function saveTxns(rows) {
    try { localStorage.setItem(scopedKey(TXN_KEY), JSON.stringify(rows)); } catch {}
}

export async function loadState() {
    const existing = getStates();
    let state = existing.length ? existing[0] : null;

    // Check cloud persistence if authenticated
    try {
        const token = localStorage.getItem('career_coach_token');
        if (token) {
            const serverStates = await base44.entities.CareerState.list();
            if (serverStates && serverStates.length > 0) {
                const serverState = serverStates[0];
                if (state) {
                    const localTime = new Date(state.updated_date || state.created_date || 0).getTime();
                    const serverTime = new Date(serverState.updated_date || serverState.created_date || 0).getTime();
                    if (serverTime >= localTime) {
                        state = serverState;
                        saveStates([state]);
                    }
                } else {
                    state = serverState;
                    saveStates([state]);
                }
            }
        }
    } catch {
        /* Fall back to local state */
    }

    if (!state) {
        state = { id: uid(), created_date: now(), updated_date: now(), ...DEFAULTS };
        saveStates([state]);
        // Also persist to cloud
        try {
            const token = localStorage.getItem('career_coach_token');
            if (token) {
                base44.entities.CareerState.create(state).catch(() => {});
            }
        } catch {}
    }

    return state;
}

/** Append-only ledger write + wallet mutation, guarded by reference_id idempotency. */
export async function awardCoins(state, { amount, xp = 0, transaction_type, description, reference_id }) {
    if (!Number.isFinite(amount) || amount <= 0) throw new Error('Award amount must be a positive number.');
    if (!Number.isFinite(xp) || xp < 0) throw new Error('XP must be a non-negative number.');

    // Idempotency guard locally
    if (reference_id) {
        const dupes = getTxns().filter(t => t.reference_id === reference_id);
        if (dupes.length) return state;
    }

    const balance_after = state.coin_balance + amount;
    const txnRecord = {
        id: uid(),
        created_date: now(),
        amount,
        transaction_type,
        description,
        reference_id,
        balance_after
    };

    const txns = getTxns();
    txns.push(txnRecord);
    saveTxns(txns);

    // Persist ledger entry to MongoDB Atlas
    base44.entities.CoinTransaction.create(txnRecord).catch(() => {});

    const { todayStr, dayCode, yesterdayStr } = getTodayInfo();

    const activeDaysSet = new Set(state.active_days || []);
    activeDaysSet.add(dayCode);
    const active_days = Array.from(activeDaysSet);

    let streak_days = state.streak_days || 0;
    const lastActive = state.last_active_date;

    if (lastActive === todayStr) {
        if (streak_days === 0) streak_days = 1;
    } else if (lastActive === yesterdayStr) {
        streak_days += 1;
    } else {
        streak_days = 1;
    }

    const longest_streak = Math.max(state.longest_streak || 0, streak_days);
    const coins_today = (lastActive === todayStr ? (state.coins_today || 0) : 0) + amount;

    const patch = {
        coin_balance: balance_after,
        lifetime_earned: (state.lifetime_earned || 0) + amount,
        coins_today,
        xp: (state.xp || 0) + xp,
        streak_days,
        longest_streak,
        active_days,
        last_active_date: todayStr
    };
    return updateState(state.id, patch);
}

export async function spendCoins(state, { amount, transaction_type, description, reference_id }) {
    if (!Number.isFinite(amount) || amount <= 0) throw new Error('Spend amount must be a positive number.');
    if (reference_id && getTxns().some(t => t.reference_id === reference_id)) return state;
    if (state.coin_balance < amount) throw new Error("Insufficient Career Coins");

    const balance_after = state.coin_balance - amount;
    const txnRecord = {
        id: uid(),
        created_date: now(),
        amount: -amount,
        transaction_type,
        description,
        reference_id,
        balance_after
    };

    const txns = getTxns();
    txns.push(txnRecord);
    saveTxns(txns);

    // Persist ledger entry to MongoDB Atlas
    base44.entities.CoinTransaction.create(txnRecord).catch(() => {});

    return updateState(state.id, {
        coin_balance: balance_after,
        lifetime_spent: (state.lifetime_spent || 0) + amount
    });
}

export async function setScores(state, patch) {
    return updateState(state.id, patch);
}

function updateState(id, patch) {
    const rows = getStates();
    const idx = rows.findIndex(r => r.id === id);
    if (idx === -1) throw new Error('CareerState not found');
    rows[idx] = { ...rows[idx], ...patch, updated_date: now() };
    saveStates(rows);

    if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("career-state-updated", { detail: rows[idx] }));
    }

    // Persist CareerState patch to MongoDB Atlas
    base44.entities.CareerState.update(id, patch).catch(() => {});

    return rows[idx];
}