function ProtectedRoute({ children }) {
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "/";
        return null;
    }

    return children;
}
import {
    BrowserRouter,
    Routes,
    Route,
    Link,
    useLocation
} from "react-router-dom";import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./pages/Login";
import Books from "./pages/Books";
import IssueReturn from "./pages/IssueReturn";
import Transactions from "./pages/Transactions";
function Navigation() {
    const location = useLocation();

    if (location.pathname === "/") {
        return null;
    }

    return (
        <nav className="navigation">
            <div className="nav-brand">
                <h2>LibraTrack</h2>
                <p>Library Management</p>
            </div>

<div className="nav-links">
    <Link to="/dashboard">Dashboard</Link>
    <Link to="/books">Books</Link>
    <Link to="/issue-return">Issue / Return</Link>
    <Link to="/transactions">Transactions</Link>

    <button
        type="button"
        onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/";
        }}
    >
        Logout
    </button>
</div>
        </nav>
    );
}
function Dashboard() {
    const [stats, setStats] = useState({
        totalBooks: 0,
        availableBooks: 0,
        issuedBooks: 0,
        overdueBooks: 0
    });
    const [issuedBooks, setIssuedBooks] = useState([]);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await axios.get(
                    "http://localhost:5000/api/transactions/stats",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setStats(response.data.stats);
            } catch (error) {
                console.error("Failed to fetch dashboard stats:", error);
            }
        };

        fetchStats();
        const fetchIssuedBooks = async () => {
    try {
        const token = localStorage.getItem("token");

        const response = await axios.get(
            "http://localhost:5000/api/transactions/currently-issued",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        setIssuedBooks(response.data.books);
    } catch (error) {
        console.error(
            "Failed to fetch currently issued books:",
            error
        );
    }
};
fetchStats();
fetchIssuedBooks();
    }, []);

    return (
        <div className="content">
            <h2>Dashboard</h2>

            <div className="stats">
                <div className="stat-card">
                    <h3>Total Books</h3>
                    <p>{stats.totalBooks}</p>
                </div>
                <div className="issued-books-section">
    <h3>Currently Issued Books</h3>

    {issuedBooks.length === 0 ? (
        <p>No books are currently issued.</p>
    ) : (
        <table className="books-table">
            <thead>
                <tr>
                    <th>Book ID</th>
                    <th>Book Title</th>
                    <th>Borrower</th>
                    <th>Email</th>
                    <th>Due Date</th>
                    <th>Days Overdue</th>
                </tr>
            </thead>

            <tbody>
                {issuedBooks.map((book) => (
                    <tr key={book.id}>
                        <td>{book.book_id}</td>
                        <td>{book.title}</td>
                        <td>{book.borrower_name}</td>
                        <td>{book.borrower_email}</td>
                        <td>
                            {new Date(
                                book.due_at
                            ).toLocaleDateString()}
                        </td>
                        <td>
                            {Number(book.days_overdue) > 0
                                ? `${Math.floor(
                                      Number(book.days_overdue)
                                  )} days`
                                : "On time"}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    )}
</div>

                <div className="stat-card">
                    <h3>Available Books</h3>
                    <p>{stats.availableBooks}</p>
                </div>

                <div className="stat-card">
                    <h3>Issued Books</h3>
                    <p>{stats.issuedBooks}</p>
                </div>

                <div className="stat-card">
                    <h3>Overdue Books</h3>
                    <p>{stats.overdueBooks}</p>
                </div>
            </div>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Navigation />
            <Routes>
    <Route path="/" element={<Login />} />

    <Route
        path="/dashboard"
        element={
            <ProtectedRoute>
                <Dashboard />
            </ProtectedRoute>
        }
    />

    <Route
        path="/books"
        element={
            <ProtectedRoute>
                <Books />
            </ProtectedRoute>
        }
    />

    <Route
        path="/issue-return"
        element={
            <ProtectedRoute>
                <IssueReturn />
            </ProtectedRoute>
        }
    />

    <Route
        path="/transactions"
        element={
            <ProtectedRoute>
                <Transactions />
            </ProtectedRoute>
        }
    />
</Routes>
        </BrowserRouter>
    );
}

export default App;