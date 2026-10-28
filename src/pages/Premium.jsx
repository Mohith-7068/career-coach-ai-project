import React, { useState } from "react";
import { usePageState } from "@/lib/usePageState";
import { base44 } from "@/api/base44Client";
import { spendCoins } from "@/lib/careerState";
import { PREMIUM_FEATURES } from "@/lib/careerData";
import PageHeader from "@/components/ui/PageHeader";
import ErrorBanner from "@/components/ui/ErrorBanner";
import Spinner from "@/components/ui/Spinner";

const COIN_COST = 500;
const COIN_DAYS = 7;
const PURCHASE_DAYS = 30;

export default function Premium() {
    const { state, refresh } = usePageState();
    const [busy, setBusy] = useState("");
    const [error, setError] = useState("");
    const [done, setDone] = useState("");

    if (!state) return <div className="text-[#68665F] text-sm">Loading plan…</div>;

    const isPremium = state.plan === "PREMIUM";

    async function redeemCoins() {
        setBusy("coins");
        setError("");
        setDone("");
        try {
            if (state.coin_balance < COIN_COST) {
                setError(`You need ${COIN_COST} coins to redeem. You have ${state.coin_balance}.`);
                setBusy("");
                return;
            }
            const next = await spendCoins(state, {
                amount: COIN_COST,
                transaction_type: "PREMIUM_UNLOCK_COINS",
                description: `${COIN_DAYS} days Premium via coin redemption`,
                reference_id: `premium_coins_${state.id}_${Date.now()}`
            });
            const expires = new Date(Date.now() + COIN_DAYS * 86400000).toISOString();
            const updated = await base44.entities.CareerState.update(next.id, {
                plan: "PREMIUM",
                plan_acquisition: "PREMIUM_BY_COINS",
                plan_expires_at: expires
            });
            await refresh();
            setDone(`Premium unlocked for ${COIN_DAYS} days using ${COIN_COST} Career Coins.`);
        } catch (e) {
            setError(e.message || "Redemption failed.");
        } finally {
            setBusy("");
        }
    }

    async function demoPurchase() {
        setBusy("purchase");
        setError("");
        setDone("");
        try {
            // Simulated checkout — no real payment. Awards a small bonus for trying.
            const expires = new Date(Date.now() + PURCHASE_DAYS * 86400000).toISOString();
            const updated = await base44.entities.CareerState.update(state.id, {
                plan: "PREMIUM",
                plan_acquisition: "PREMIUM_BY_PURCHASE",
                plan_expires_at: expires
            });
            await refresh();
            setDone(`Demo checkout complete — Premium unlocked for ${PURCHASE_DAYS} days.`);
        } catch (e) {
            setError(e.message || "Purchase failed.");
        } finally {
            setBusy("");
        }
    }

    return (
        <div>
            <PageHeader
                eyebrow="Premium"
                title="Premium Plan"
                subtitle="Unlock advanced resume reviews, unlimited daily challenges and an expert technical coach. Two ways to upgrade."
            />

            {error && <div className="mb-6"><ErrorBanner message={error} /></div>}
            {done && (
                <div className="mb-6 p-3 rounded-md bg-[#E8F2EE] border border-[#B8DACD] text-[#174A3A] text-sm font-semibold">
                    🎉 {done}
                </div>
            )}

            {/* Current plan */}
            <div className="editorial-panel p-6 rounded-lg mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <p className="eyebrow mb-1">Current Plan</p>
                    <p className={`text-2xl font-bold ${isPremium ? "text-[#174A3A]" : "text-[#1C1C1A]"}`}>
                        {state.plan}
                        {isPremium && <span className="text-sm text-[#68665F] font-medium ml-2">· {state.plan_acquisition}</span>}
                    </p>
                    {state.plan_expires_at && (
                        <p className="text-xs text-[#68665F] mt-1">
                            Expires {new Date(state.plan_expires_at).toLocaleDateString()}
                        </p>
                    )}
                </div>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${isPremium ? "badge-forest" : "bg-[#FAF7F0] text-[#68665F] border border-[#E5E0D5]"}`}>
                    {isPremium ? "Premium Active" : "Free Plan"}
                </span>
            </div>

            {/* Upgrade paths */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                <div className="editorial-panel p-7 rounded-lg">
                    <p className="eyebrow mb-2">Redeem with Coins</p>
                    <p className="text-2xl font-bold text-[#1C1C1A] mb-1">{COIN_COST} 🪙</p>
                    <p className="text-sm text-[#68665F] mb-5">→ {COIN_DAYS} days of Premium</p>
                    <button
                        onClick={redeemCoins}
                        disabled={busy === "coins" || isPremium}
                        className="btn-primary w-full py-3 font-semibold rounded-md text-sm shadow-sm flex items-center justify-center gap-2"
                    >
                        {busy === "coins" && <Spinner color="#FFFFFF" />}
                        {busy === "coins" ? "Redeeming…" : `Redeem ${COIN_COST} Coins`}
                    </button>
                    <p className="text-xs text-[#68665F] mt-3">You have {state.coin_balance} coins.</p>
                </div>

                <div className="editorial-panel p-7 rounded-lg">
                    <p className="eyebrow mb-2">Demo Purchase</p>
                    <p className="text-2xl font-bold text-[#1C1C1A] mb-1">₹0 <span className="text-base font-normal text-[#68665F]">(simulated)</span></p>
                    <p className="text-sm text-[#68665F] mb-5">→ {PURCHASE_DAYS} days of Premium</p>
                    <button
                        onClick={demoPurchase}
                        disabled={busy === "purchase" || isPremium}
                        className="btn-primary w-full py-3 font-semibold rounded-md text-sm shadow-sm flex items-center justify-center gap-2"
                    >
                        {busy === "purchase" && <Spinner color="#FFFFFF" />}
                        {busy === "purchase" ? "Processing…" : "Run Demo Checkout"}
                    </button>
                    <p className="text-xs text-[#68665F] mt-3">A simulated checkout — no real payment is taken.</p>
                </div>
            </div>

            {/* Feature list */}
            <div className="editorial-panel p-7 rounded-lg">
                <p className="eyebrow mb-4">What Premium Unlocks</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {PREMIUM_FEATURES.map((f) => (
                        <div key={f.key} className="flex items-center gap-3 px-4 py-3 rounded-md bg-[#FAF7F0] border border-[#E5E0D5]">
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isPremium ? "bg-[#174A3A] text-white" : "bg-[#E5E0D5] text-[#68665F]"}`}>
                                {isPremium ? "✓" : "🔒"}
                            </span>
                            <span className="text-sm font-medium text-[#1C1C1A]">{f.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}