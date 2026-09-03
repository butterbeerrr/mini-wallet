import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import BalanceCard from "../components/BalanceCard";
import TopUpForm from "../components/TopUpForm";
import TransferForm from "../components/TransferForm";
import TransactionHistory from "../components/TransactionHistory";

function Dashboard() {
    const navigate = useNavigate();

    const [balance, setBalance] = useState(null);
    const [error, setError] = useState("");

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
        <div>
            <h1>Mini Wallet</h1>

            <p>Welcome, {user?.username}</p>

            <button onClick={handleLogout}>
                Logout
            </button>

            <BalanceCard
                balance={balance}
                error={error}
            />

            <TopUpForm
                onSuccess={(newBalance) => {
                    setBalance(newBalance);
                }}
            />

            <TransferForm
                onSuccess={fetchBalance}
            />

            <TransactionHistory/>
        </div>
    );
}

export default Dashboard;