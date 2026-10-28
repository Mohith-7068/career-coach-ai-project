import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { usePageState } from "@/lib/usePageState";
import { base44 } from "@/api/base44Client";
import { awardCoins } from "@/lib/careerState";
import { REWARDS } from "@/lib/careerData";
import PageHeader from "@/components/ui/PageHeader";
import ErrorBanner from "@/components/ui/ErrorBanner";

export default function Rewards() {
    const { state, refresh } = usePageState();
    const [claimed, setClaimed] = useState({});
    const [busy, setBusy] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        if (!state) return;
        let active = true;
        base44.entities.RewardClaim.filter({})
            .then((rows) => {
                if (!active) return;
                const map = {};
                rows.forEach((r) => (map[r.reward_id] = true));
                setClaimed(map);
            })
            .catch((e) => {
                if (active) setError(e?.message || "Could not load your reward claims.");
            });
        return () => { active = false; };
    }, [state?.id]);

    async function claim(reward) {
        setBusy(reward.id);
        setError("");
        try {
            // streak milestone is only claimable when streak >= 7
            if (reward.id === "REW_STREAK_07" && (state?.streak_days || 0) < 7) {
                setError("Reach a 7-day streak to claim this milestone.");
                setBusy("");
                return;
            }
            // Award first with a stable idempotency key. If recording the claim
            // fails, retrying cannot pay the same reward twice.
            await awardCoins(state, {
                amount: reward.coins,
                xp: reward.xp,
                transaction_type: "REWARD_CLAIM",
                description: reward.title,
                reference_id: `reward_${state.id}_${reward.id}`
            });
            await base44.entities.RewardClaim.create({
                reward_id: reward.id,
                coins: reward.coins,
                xp: reward.xp
            });
            setClaimed((c) => ({ ...c, [reward.id]: true }));
            await refresh();
        } catch (e) {
            setError(e.message || "Failed to claim reward.");
        } finally {
            setBusy("");
        }
    }

    return (
        <div>
            <PageHeader
                eyebrow="Rewards Catalog"
                title="Rewards"
                subtitle="Earn Career Coins and XP by completing real practice. Coins are granted only after an activity is confirmed complete."
            />

            {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {REWARDS.map((reward) => {
                    const isClaimed = claimed[reward.id];
                    const locked = reward.id === "REW_STREAK_07" && (state?.streak_days || 0) < 7;
                    return (
                        <div key={reward.id} className="editorial-panel p-6 rounded-lg flex flex-col">
                            <div className="flex items-start justify-between gap-3 mb-3">
                                <h3 className="text-lg font-semibold text-[#1C1C1A]">{reward.title}</h3>
                                <span className="text-[10px] font-mono text-[#68665F] shrink-0">{reward.id}</span>
                            </div>
                            <p className="text-sm text-[#68665F] leading-relaxed flex-1">{reward.description}</p>
                            <div className="flex gap-2 mt-4">
                                <span className="badge-coin px-2.5 py-1 rounded-full text-xs font-semibold">🪙 +{reward.coins}</span>
                                <span className="badge-forest px-2.5 py-1 rounded-full text-xs font-semibold">+{reward.xp} XP</span>
                            </div>
                            <div className="mt-5">
                                {isClaimed ? (
                                    <div className="w-full py-3 rounded-md text-sm font-semibold text-center bg-[#E8F2EE] text-[#174A3A] border border-[#B8DACD]">
                                        Claimed ✓
                                    </div>
                                ) : locked ? (
                                    <div className="w-full py-3 rounded-md text-sm font-semibold text-center bg-[#FAF7F0] text-[#68665F] border border-[#E5E0D5]">
                                        Locked — {state?.streak_days || 0}/7 day streak
                                    </div>
                                ) : reward.action_type === "STREAK_MILESTONE" ? (
                                    <button
                                        onClick={() => claim(reward)}
                                        disabled={busy === reward.id}
                                        className="btn-primary w-full py-3 font-semibold rounded-md text-sm shadow-sm"
                                    >
                                        {busy === reward.id ? "Claiming…" : "Claim Reward"}
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <Link
                                            to={reward.href}
                                            className="flex-1 btn-primary text-center py-3 font-semibold rounded-md text-sm shadow-sm"
                                        >
                                            Start Activity →
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}