import { useEffect, useState } from "react";
import axios from "axios";

function Transactions() {
        const [transactions, setTransactions] = useState([]);
        const [error, setError] = useState("");
        const [search, setSearch] = useState("");
        const [statusFilter, setStatusFilter] = useState("ALL");

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/transactions",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setTransactions(response.data.transactions);

            } catch (error) {
                console.error(error);
                setError("Failed to load transaction history");
            }
        };

        fetchTransactions();
    }, []);
    const filteredTransactions = transactions.filter((transaction) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
        transaction.book_id.toLowerCase().includes(searchText) ||
        transaction.title.toLowerCase().includes(searchText) ||
        transaction.borrower_name.toLowerCase().includes(searchText);

    const matchesStatus =
        statusFilter === "ALL" ||
        transaction.status === statusFilter;

    return matchesSearch && matchesStatus;
    });

    return (
        <div className="content">
            <h2>Transaction History</h2>
            <div className="transaction-filters">
    <input
        type="text"
        placeholder="Search by book or borrower..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
    />

    <select
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
    >
        <option value="ALL">All Status</option>
        <option value="ISSUED">Issued</option>
        <option value="RETURNED">Returned</option>
    </select>
</div>

            {error && (
                <p className="login-error">
                    {error}
                </p>
            )}

            <table className="books-table">
                <thead>
                    <tr>
                        <th>Book ID</th>
                        <th>Book Title</th>
                        <th>Author</th>
                        <th>Borrower</th>
                        <th>Issue Date</th>
                        <th>Return Date</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.book_id}</td>
                            <td>{transaction.title}</td>
                            <td>{transaction.author}</td>
                            <td>{transaction.borrower_name}</td>

                            <td>
                                {new Date(
                                    transaction.issued_at
                                ).toLocaleString()}
                            </td>

                            <td>
                                {transaction.returned_at
                                    ? new Date(
                                          transaction.returned_at
                                      ).toLocaleString()
                                    : "-"}
                            </td>

                            <td>
                                {transaction.status}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Transactions;