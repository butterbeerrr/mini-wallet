import { useState } from "react";
import { Send, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import api from "../services/api";

function TransferForm({ onSuccess }) {
    const [recipient, setRecipient] = useState("");
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
            const response = await api.post("/transfer", {
                recipient,
                amount,
            });

            setMessage(response.data.message);
            setRecipient("");
            setAmount("");

            onSuccess();
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
        <section className="bg-white rounded-2xl border border-sky-100 p-5 shadow-sm md:p-6">
            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100">
                    <Send size={19} className="text-sky-600" />
                </div>

                <div>
                    <h2 className="text-base md:text-lg font-semibold text-slate-900">
                        Transfer
                    </h2>

                    <p className="text-xs md:text-sm text-slate-500">
                        Send money to another user
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Recipient */}
                <div>
                    <label
                        htmlFor="recipient"
                        className="block text-sm font-medium text-slate-700 mb-2"
                    >
                        Recipient Email
                    </label>

                    <input
                        id="recipient"
                        type="email"
                        value={recipient}
                        onChange={(event) => setRecipient(event.target.value)}
                        placeholder="mail@example.com"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                    />
                </div>

                {/* Amount */}
                <div>
                    <label
                        htmlFor="transfer-amount"
                        className="block text-sm font-medium text-slate-700 mb-2"
                    >
                        Amount
                    </label>

                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-400">
                            Rp
                        </span>

                        <input
                            id="transfer-amount"
                            type="number"
                            value={amount}
                            onChange={(event) => setAmount(event.target.value)}
                            placeholder="0"
                            min="1"
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:bg-white focus:ring-2 focus:ring-sky-100"
                        />
                    </div>
                </div>

                {/* Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full rounded-xl bg-sky-500 py-3 text-sm font-semibold text-white transition hover:bg-sky-600 disabled:cursor-not-allowed disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2
                                size={18}
                                className="animate-spin"
                            />
                            Processing...
                        </>
                    ) : (
                        <>
                            <Send size={18} />
                            Transfer
                        </>
                    )}
                </button>
            </form>

            {/* Error */}
            {error && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-sm text-red-600">
                    <AlertCircle size={17} />
                    <span>{error}</span>
                </div>
            )}

            {/* Success */}
            {message && (
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-green-100 bg-green-50 px-3 py-2.5 text-sm text-green-600">
                    <CheckCircle2 size={17} />
                    <span>{message}</span>
                </div>
            )}
        </section>
    );
}

export default TransferForm;