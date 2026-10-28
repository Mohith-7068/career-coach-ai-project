import React, { useEffect, useState } from "react";
import { usePageState } from "@/lib/usePageState";
import { base44 } from "@/api/base44Client";
import PageHeader from "@/components/ui/PageHeader";
import Spinner from "@/components/ui/Spinner";
import ErrorBanner from "@/components/ui/ErrorBanner";

function formatDate(d) {
    if (!d) return "";
    const date = new Date(d);
    return date.toLocaleString(undefined, {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
    });
}

export default function Wallet() {
    const { state } = usePageState();
    const [txns, setTxns] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        let active = true;
        setTxns(null);
        setError("");
        base44.entities.CoinTransaction.list("-created_date", 100)
            .then((rows) => { if (active) setTxns(rows); })
            .catch((e) => {
                if (active) {
                    setError(e?.message || "Could not load your transaction ledger.");
                    setTxns([]);
                }
            });
        return () => { active = false; };
    }, [state?.id]);

    if (!state) return <div className="text-[#68665F] text-sm">Loading wallet…</div>;

    return (
        <div>
            <PageHeader
                eyebrow="Career Coin Wallet"
                title="Wallet"
                subtitle="An immutable, append-only ledger. Every coin movement is auditable and protected against duplicate payouts."
            />

            {error && <div className="mb-6"><ErrorBanner message={error} /></div>}

            {/* Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <div className="editorial-panel p-6 rounded-lg">
                    <p className="eyebrow mb-2">Current Balance</p>
                    <p className="text-3xl font-bold text-[#1C1C1A]">🪙 {state.coin_balance}</p>
                </div>
                <div className="editorial-panel p-6 rounded-lg">
                    <p className="eyebrow mb-2">Lifetime Earned</p>
                    <p className="text-3xl font-bold text-[#2F6B57]">+{state.lifetime_earned}</p>
                </div>
                <div className="editorial-panel p-6 rounded-lg">
                    <p className="eyebrow mb-2">Lifetime Spent</p>
                    <p className="text-3xl font-bold text-[#A44732]">-{state.lifetime_spent}</p>
                </div>
            </div>

            {/* Ledger */}
            <div className="editorial-panel p-7 rounded-lg">
                <p className="eyebrow mb-4">Transaction Ledger</p>
                {!txns ? (
                    <div className="flex items-center gap-2 text-[#68665F] text-sm py-6">
                        <Spinner /> Loading ledger…
                    </div>
                ) : txns.length === 0 ? (
                    <p className="text-sm text-[#68665F] py-6">No transactions yet.</p>
                ) : (
                    <div className="divide-y divide-[#E5E0D5]">
                        {txns.map((t) => {
                            const positive = t.amount >= 0;
                            return (
                                <div key={t.id} className="flex items-center gap-4 py-3.5">
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${positive ? "bg-[#E8F2EE] text-[#2F6B57]" : "bg-[#FDF2F0] text-[#A44732]"
                                            }`}
                                    >
                                        {positive ? "+" : "−"}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-[#1C1C1A] truncate">{t.description}</p>
                                        <p className="text-xs text-[#68665F]">
                                            <span className="font-mono">{t.transaction_type}</span> · {formatDate(t.created_date)}
                                        </p>
                                    </div>
                                    <div className="text-right shrink-0">
                                        <p
                                            className="text-sm font-bold"
                                            style={{ color: positive ? "#2F6B57" : "#A44732" }}
                                        >
                                            {positive ? "+" : "−"}{Math.abs(t.amount)} 🪙
                                        </p>
                                        <p className="text-xs text-[#68665F]">bal {t.balance_after}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}