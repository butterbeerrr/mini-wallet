import { useEffect, useState } from "react";
import {
    ArrowDownLeft,
    ArrowUpRight,
    History,
    Loader2,
    AlertCircle,
} from "lucide-react";
import api from "../services/api";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";

function Transactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const getTransactions = async () => {
            try {
                const response = await api.get("/transactions");
                setTransactions(response.data.transactions);
            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load transactions."
                );
            } finally {
                setLoading(false);
            }
        };

        getTransactions();
    }, []);

    const handleLogout = async () => {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error(error);
        }

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.location.href = "/";
    };

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
        <div className="min-h-screen bg-sky-50 text-slate-800">
            <Header
                onMenuClick={() => setIsSidebarOpen(true)}
            />

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
                user={user}
                onLogout={handleLogout}
            />

            <main className="md:ml-64">
                <div className="max-w-6xl mx-auto px-4 py-6 md:px-8 md:py-10">

                    <div className="mb-6">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                            Transactions
                        </h1>

                        <p className="text-sm text-slate-500 mt-1">
                            View your transaction history.
                        </p>
                    </div>

                    <section className="bg-white rounded-2xl border border-sky-100 shadow-sm p-5 md:p-6">

                        <div className="flex items-center gap-3 mb-5">
                            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">
                                <History
                                    size={20}
                                    className="text-sky-600"
                                />
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-slate-900">
                                    Transaction History
                                </h2>

                                <p className="text-sm text-slate-500">
                                    Your wallet activity
                                </p>
                            </div>
                        </div>

                        {loading && (
                            <div className="flex justify-center items-center gap-2 py-10 text-sm text-slate-500">
                                <Loader2
                                    size={18}
                                    className="animate-spin text-sky-500"
                                />
                                Loading transactions...
                            </div>
                        )}

                        {!loading && error && (
                            <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-xl px-4 py-3 text-sm">
                                <AlertCircle size={18} />
                                {error}
                            </div>
                        )}

                        {!loading &&
                            !error &&
                            transactions.length === 0 && (
                                <div className="text-center py-10">
                                    <History
                                        size={32}
                                        className="mx-auto mb-3 text-slate-300"
                                    />

                                    <p className="text-sm font-medium text-slate-600">
                                        No transactions yet
                                    </p>

                                    <p className="text-xs text-slate-400 mt-1">
                                        Your wallet activity will appear here.
                                    </p>
                                </div>
                            )}

                        {!loading &&
                            !error &&
                            transactions.length > 0 && (
                                <div className="divide-y divide-slate-100">
                                    {transactions.map((transaction) => {
                                        const isCredit =
                                            transaction.type === "credit" ||
                                            transaction.type === "topup";

                                        return (
                                            <div
                                                key={transaction.id}
                                                className="flex items-center justify-between gap-4 py-4"
                                            >
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div
                                                        className={`w-10 h-10 shrink-0 rounded-xl flex items-center justify-center ${
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
                                                    {formatCurrency(
                                                        transaction.amount
                                                    )}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Transactions;