import { useEffect, useState } from "react";
import axios from "axios";

function Transactions() {
        const [transactions, setTransactions] = useState([]);
        const [error, setError] = useState("");
        const [search, setSearch] = useState("");
        const [statusFilter, setStatusFilter] = useState("ALL");
        const exportCSV = () => {
    const headers = [
        "Book Title",
        "Author",
        "Book ID",
        "Issued To",
        "Issue Timestamp",
        "Return Timestamp",
        "Current Status"
    ];

    const rows = filteredTransactions.map((transaction) => [
        transaction.title,
        transaction.author,
        transaction.book_id,
        transaction.borrower_name,
        transaction.issued_at,
        transaction.returned_at || "",
        transaction.status
    ]);

    const csvContent = [
        headers,
        ...rows
    ]
        .map((row) =>
            row
                .map((value) => `"${String(value).replace(/"/g, '""')}"`)
                .join(",")
        )
        .join("\n");

    const blob = new Blob([csvContent], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "library_transaction_history.csv";
    link.click();

    URL.revokeObjectURL(url);
};

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "https://libra-track-orpin.vercel.app/api/transactions",
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
            <button type="button" onClick={exportCSV}>
                     Export CSV
            </button>
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
