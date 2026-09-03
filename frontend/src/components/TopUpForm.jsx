import { useState } from "react";
import api from "../services/api";

function TopUpForm({ onSuccess }) {
    const [amount, setAmount] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setMessage("");
        setLoading(true);

        try {
            const response = await api.post("/topup", {
                amount,
            });

            setMessage(response.data.message);
            setAmount("");

            onSuccess(response.data.balance);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "An error occurred."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <h2>Top Up</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="number"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder="Enter Amount"
                    min="1"
                />

                <button type="submit" disabled={loading}>
                    {loading ? "Processing..." : "Top Up"}
                </button>
            </form>

            {error && <p>{error}</p>}
            {message && <p>{message}</p>}
        </section>
    );
}

export default TopUpForm;