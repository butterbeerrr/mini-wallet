import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import BalanceCard from "../components/BalanceCard";
import TopUpForm from "../components/TopUpForm";
import TransferForm from "../components/TransferForm";
import TransactionHistory from "../components/TransactionHistory";

function Dashboard() {
    const navigate = useNavigate();

    const [balance, setBalance] = useState(null);
    const [error, setError] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [transactionRefresh, setTransactionRefresh] = useState(0);

    const user = JSON.parse(localStorage.getItem("user"));

    const fetchBalance = async () => {
        try {
            const response = await api.get("/wallet");

            setBalance(response.data.balance);
            setError("");
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "An error occurred."
            );
        }
    };

    useEffect(() => {
        fetchBalance();
    }, []);

    const handleLogout = async () => {
        try {
            await api.post("/logout");
        } catch (error) {
            console.error(error);
        } finally {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            navigate("/");
        }
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

                    {/* Welcome */}
                    <div className="mb-6 md:mb-8">
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                            Welcome back, {user?.username} 👋
                        </h1>

                        <p className="text-sm md:text-base text-slate-500 mt-1">
                            Manage your money easily with MiniWallet.
                        </p>
                    </div>

                    {/* Balance */}
                    <BalanceCard
                        balance={balance}
                        error={error}
                    />

                    {/* Top Up & Transfer */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-6">

                        <TopUpForm
                            onSuccess={(newBalance) => {
                                setBalance(newBalance);
                                setTransactionRefresh((prev) => prev + 1);
                            }}
                        />

                        <TransferForm
                            onSuccess={() => {
                                fetchBalance();
                                setTransactionRefresh((prev) => prev + 1);
                            }}
                        />

                    </div>

                    {/* Recent Transactions */}
                    <div className="mt-6">
                        <TransactionHistory
                            refreshKey={transactionRefresh}
                        />
                    </div>

                </div>
            </main>
        </div>
    );
}

export default Dashboard;