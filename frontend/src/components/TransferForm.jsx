import { useState } from "react";
import api from "../services/api";

function TransferForm({ onSuccess }) {
    const [form, setForm] = useState({
        recipient: "",
        amount: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");
        setLoading(true);

        try {
            const response = await api.post("/transfer", form);

            setSuccess(response.data.message);

            setForm({
                recipient: "",
                amount: "",
            });

            await onSuccess();
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Transfer failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <section>
            <h2>Transfer</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Recipient Email</label>

                    <input
                        type="email"
                        name="recipient"
                        value={form.recipient}
                        onChange={handleChange}
                        placeholder="mail@example.com"
                    />
                </div>

                <div>
                    <label>Amount</label>

                    <input
                        type="number"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="100000"
                        min="1"
                    />
                </div>

                {error && <p>{error}</p>}

                {success && <p>{success}</p>}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Transfer"}
                </button>
            </form>
        </section>
    );
}

export default TransferForm;