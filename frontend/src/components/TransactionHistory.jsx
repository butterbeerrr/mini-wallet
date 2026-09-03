import { useEffect, useState } from "react";
import api from "../services/api";

function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchTransactions = async () => {
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

    useEffect(() => {
        fetchTransactions();
    }, []);

    if (loading) {
        return <p>Loading transactions...</p>;
    }

    return (
        <section>
            <h2>Transaction History</h2>

            {error && <p>{error}</p>}

            {!error && transactions.length === 0 && (
                <p>No transactions yet.</p>
            )}

            {!error && transactions.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Description</th>
                            <th>Date</th>
                        </tr>
                    </thead>

                    <tbody>
                        {transactions.map((transaction) => (
                            <tr key={transaction.id}>
                                <td>{transaction.type}</td>
                                <td>{transaction.amount}</td>
                                <td>{transaction.description}</td>
                                <td>
                                    {new Date(
                                        transaction.created_at
                                    ).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </section>
    );
}

export default TransactionHistory;