import { useEffect, useState } from "react";
import axios from "axios";
import QRScanner from "../components/QRScanner";

function IssueReturn() {
    const [scannedBookId, setScannedBookId] = useState("");
    const [members, setMembers] = useState([]);
    const [newMemberName, setNewMemberName] = useState("");
    const [newMemberEmail, setNewMemberEmail] = useState("");
    const [selectedMember, setSelectedMember] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [activeTransaction, setActiveTransaction] = useState(null);
    const [loadingTransaction, setLoadingTransaction] = useState(false);

    const handleScan = async (bookId) => {
        setScannedBookId(bookId);
        setActiveTransaction(null);
        setSelectedMember("");
        setDueDate("");
        setError("");
        setMessage("");
        setLoadingTransaction(true);

        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `http://localhost:5000/api/transactions/book/${bookId}/active`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setActiveTransaction(response.data.transaction);

        } catch (error) {
            const errorMessage = error.response?.data?.message;
        
    if (errorMessage === "Book not found") {
        setError("Invalid QR code: book not found");
        setScannedBookId("");
        setActiveTransaction(null);
    } else {
        // No active transaction means the book is available for issue.
        setActiveTransaction(null);
    }
} finally {
            setLoadingTransaction(false);
        }
    };

useEffect(() => {
    const fetchMembers = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/auth/members",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMembers(response.data.members);
        } catch (error) {
            console.error("Failed to fetch borrowers:", error);
        }
    };

    fetchMembers();
}, []);

const handleAddMember = async () => {
    if (!newMemberName || !newMemberEmail) {
        setError("Please enter borrower name and email");
        return;
    }

    try {
        setError("");
        setMessage("");

        const token = localStorage.getItem("token");

        const response = await axios.post(
            "http://localhost:5000/api/auth/members",
            {
                name: newMemberName,
                email: newMemberEmail
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setMembers((previous) => [
            ...previous,
            response.data.member
        ]);

        setNewMemberName("");
        setNewMemberEmail("");

        setMessage("Borrower added successfully!");
    } catch (error) {
        setError(
            error.response?.data?.message ||
            "Failed to add borrower"
        );
    }
};

    const handleIssue = async () => {
        if (!scannedBookId || !selectedMember || !dueDate) {
            setError(
                "Please scan a book, select a borrower and choose a due date"
            );
            return;
        }

        try {
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:5000/api/transactions/issue",
                {
                    book_id: scannedBookId,
                    user_id: Number(selectedMember),
                    due_at: new Date(dueDate).toISOString()
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Book issued successfully!");

            setScannedBookId("");
            setSelectedMember("");
            setDueDate("");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to issue book"
            );
        }
    };

    const handleReturn = async () => {
        try {
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:5000/api/transactions/return",
                {
                    transaction_id: activeTransaction.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("Book returned successfully!");
            setActiveTransaction(null);
            setScannedBookId("");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to return book"
            );
        }
    };

    return (
        <div className="content">
            <h2>Issue / Return</h2>

            <div className="scanner-card">
                <div className="add-member-card">
    <h3>Add Borrower</h3>

    <div className="member-form">
        <input
            type="text"
            placeholder="Borrower name"
            value={newMemberName}
            onChange={(e) =>
                setNewMemberName(e.target.value)
            }
        />

        <input
            type="email"
            placeholder="Borrower email"
            value={newMemberEmail}
            onChange={(e) =>
                setNewMemberEmail(e.target.value)
            }
        />

        <button
            type="button"
            onClick={handleAddMember}
        >
            Add Borrower
        </button>
    </div>
</div>
                <h3>Scan Book QR Code</h3>

                <QRScanner onScan={handleScan} />

                {scannedBookId && (
                    <div className="scan-result">
                        <h3>Scanned Book ID</h3>
                        <p>{scannedBookId}</p>

                        {loadingTransaction && (
                            <p>Checking book status...</p>
                        )}

                        {activeTransaction ? (
                            <div>
                                <h3>Currently Issued To</h3>

                                <p>
                                    {activeTransaction.borrower_name}
                                </p>

                                <p>
                                    Due:{" "}
                                    {new Date(
                                        activeTransaction.due_at
                                    ).toLocaleDateString()}
                                </p>

                                <button
                                    type="button"
                                    onClick={handleReturn}
                                >
                                    Return Book
                                </button>
                            </div>
                        ) : (
                            !loadingTransaction && (
                                <div>
                                    <label>
                                        Select Borrower
                                    </label>

                                    <select
                                        value={selectedMember}
                                        onChange={(e) =>
                                            setSelectedMember(e.target.value)
                                        }
                                    >
                                        <option value="">
                                            Select a borrower
                                        </option>

                                        {members.map((member) => (
                                            <option
                                                key={member.id}
                                                value={member.id}
                                            >
                                                {member.name} ({member.email})
                                            </option>
                                        ))}
                                    </select>

                                    <label>
                                        Due Date
                                    </label>

                                    <input
                                        type="date"
                                        value={dueDate}
                                        onChange={(e) =>
                                            setDueDate(e.target.value)
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={handleIssue}
                                        disabled={
                                            !selectedMember || !dueDate
                                        }
                                    >
                                        Issue Book
                                    </button>
                                </div>
                            )
                        )}
                    </div>
                )}

                {message && (
                    <p className="success-message">
                        {message}
                    </p>
                )}

                {error && (
                    <p className="login-error">
                        {error}
                    </p>
                )}
            </div>
        </div>
    );
}

export default IssueReturn;