import { useEffect, useState } from "react";
import {
    ArrowDownLeft,
    ArrowUpRight,
    History,
    Loader2,
    AlertCircle,
} from "lucide-react";
import api from "../services/api";

function TransactionHistory({ refreshKey }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTransactions = async () => {
        try {
            const response = await api.get("/transactions");

            setTransactions(response.data.transactions);
            setError("");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load transactions."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, [refreshKey]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <section className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5 md:p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">
                        <History
                            size={20}
                            className="text-sky-600"
                        />
                    </div>

                    <div>
                        <h2 className="text-base md:text-lg font-semibold text-slate-900">
                            Recent Transactions
                        </h2>

                        <p className="text-xs md:text-sm text-slate-500">
                            Your latest wallet activity
                        </p>
                    </div>
                </div>
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex items-center justify-center gap-2 py-8 text-sm text-slate-500">
                    <Loader2
                        size={18}
                        className="animate-spin text-sky-500"
                    />

                    <span>Loading transactions...</span>
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                    <AlertCircle size={18} />

                    <span>{error}</span>
                </div>
            )}

            {/* Empty */}
            {!loading && !error && transactions.length === 0 && (
                <div className="py-8 text-center">
                    <History
                        size={28}
                        className="mx-auto mb-2 text-slate-300"
                    />

                    <p className="text-sm font-medium text-slate-600">
                        No transactions yet
                    </p>

                    <p className="text-xs text-slate-400 mt-1">
                        Your wallet activity will appear here.
                    </p>
                </div>
            )}

            {/* Transactions */}
            {!loading && !error && transactions.length > 0 && (
                <div className="divide-y divide-slate-100">
                    {transactions.map((transaction) => {
                        const isCredit =
                            transaction.type === "credit" ||
                            transaction.type === "topup";

                        return (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between gap-4 py-4 first:pt-1 last:pb-1"
                            >
                                {/* Transaction Info */}
                                <div className="flex items-center gap-3 min-w-0">
                                    <div
                                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                                            isCredit
                                                ? "bg-sky-100 text-sky-600"
                                                : "bg-slate-100 text-slate-600"
                                        }`}
                                    >
                                        {isCredit ? (
                                            <ArrowDownLeft size={19} />
                                        ) : (
                                            <ArrowUpRight size={19} />
                                        )}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">
                                            {transaction.description}
                                        </p>

                                        <p className="text-xs text-slate-400 mt-1">
                                            {formatDate(
                                                transaction.created_at
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <p
                                    className={`shrink-0 text-sm font-semibold ${
                                        isCredit
                                            ? "text-sky-600"
                                            : "text-slate-800"
                                    }`}
                                >
                                    {isCredit ? "+" : "-"}
                                    {formatCurrency(transaction.amount)}
                                </p>
                            </div>
                        );
                    })}
                </div>
            )}
        </section>
    );
}

export default TransactionHistory;