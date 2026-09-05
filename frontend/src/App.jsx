import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Login from "./pages/Login";
import Books from "./pages/Books";
import IssueReturn from "./pages/IssueReturn";

function Dashboard() {
    const [stats, setStats] = useState({
        totalBooks: 0,
        availableBooks: 0,
        issuedBooks: 0,
        overdueBooks: 0
    });

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
    }, []);

    return (
        <div className="content">
            <h2>Dashboard</h2>

            <div className="stats">
                <div className="stat-card">
                    <h3>Total Books</h3>
                    <p>{stats.totalBooks}</p>
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
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/issue-return" element={<IssueReturn />} />
                <Route path="/books" element={<Books />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;