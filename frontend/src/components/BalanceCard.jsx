import { Wallet, AlertCircle } from "lucide-react";

function BalanceCard({ balance, error }) {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    return (
        <section className="relative overflow-hidden rounded-2xl bg-sky-500 p-6 text-white shadow-lg shadow-sky-100 md:p-8">
            {/* Decorative circles */}
            <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-white/10" />
            <div className="absolute -bottom-20 right-20 h-40 w-40 rounded-full bg-white/10" />

            <div className="relative">
                <div className="flex items-center gap-2 text-sky-100">
                    <Wallet size={18} />
                    <p className="text-sm font-medium">
                        Total Balance
                    </p>
                </div>

                {error ? (
                    <div className="mt-5 flex items-center gap-2 rounded-xl bg-white/10 p-3 text-sm">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                ) : (
                    <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                        {balance === null
                            ? "Loading..."
                            : formatCurrency(balance)}
                    </h2>
                )}

                <p className="mt-6 text-sm text-sky-100">
                    Available balance
                </p>
            </div>
        </section>
    );
}

export default BalanceCard;