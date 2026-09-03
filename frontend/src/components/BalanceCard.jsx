function BalanceCard({ balance, error }) {
    return (
        <section>
            <h2>Balance</h2>

            <p>
                {balance !== null ? balance : "Loading..."}
            </p>

            {error && <p>{error}</p>}
        </section>
    );
}

export default BalanceCard;