import { useEffect, useState } from "react";
import axios from "axios";
import QRCode from "qrcode";

function Books() {
    const [books, setBooks] = useState([]);
    const [error, setError] = useState("");
    const [qrCodes, setQrCodes] = useState({});

    const [form, setForm] = useState({
        book_id: "",
        title: "",
        author: "",
        isbn: "",
        category: "",
        total_copies: ""
    });

    const fetchBooks = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                "http://localhost:5000/api/books",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setBooks(response.data.books);
        } catch (error) {
            console.error(error);
            setError("Failed to load books");
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const token = localStorage.getItem("token");

            await axios.post(
                "http://localhost:5000/api/books",
                {
                    ...form,
                    total_copies: Number(form.total_copies)
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            alert("Book added successfully!");

            setForm({
                book_id: "",
                title: "",
                author: "",
                isbn: "",
                category: "",
                total_copies: ""
            });

            fetchBooks();

        } catch (error) {
            console.error(error);

            setError(
                error.response?.data?.message ||
                "Failed to add book"
            );
        }
    };
    const generateQRCode = async (bookId) => {
    try {
        const qrImage = await QRCode.toDataURL(bookId);

        setQrCodes((previous) => ({
            ...previous,
            [bookId]: qrImage
        }));
    } catch (error) {
        console.error("QR generation failed:", error);
    }
};

    return (
        <div className="content">
            <h2>Books</h2>

            <div className="add-book-card">
                <h3>Add New Book</h3>

                <form onSubmit={handleSubmit} className="book-form">
                    <input
                        name="book_id"
                        placeholder="Book ID"
                        value={form.book_id}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="title"
                        placeholder="Book Title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="author"
                        placeholder="Author"
                        value={form.author}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="isbn"
                        placeholder="ISBN"
                        value={form.isbn}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="category"
                        placeholder="Category"
                        value={form.category}
                        onChange={handleChange}
                        required
                    />

                    <input
                        name="total_copies"
                        type="number"
                        min="1"
                        placeholder="Total Copies"
                        value={form.total_copies}
                        onChange={handleChange}
                        required
                    />

                    <button type="submit">
                        Add Book
                    </button>
                </form>

                {error && (
                    <p className="login-error">{error}</p>
                )}
            </div>

            <table className="books-table">
                <thead>
                    <tr>
                        <th>Book ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>Category</th>
                        <th>Total Copies</th>
                        <th>Available</th>
                        <th>Status</th>
                        <th>QR Code</th>
                    </tr>
                </thead>

                <tbody>
                    {books.map((book) => (
                        <tr key={book.id}>
                            <td>{book.book_id}</td>
                            <td>{book.title}</td>
                            <td>{book.author}</td>
                            <td>{book.category}</td>
                            <td>{book.total_copies}</td>
                            <td>{book.available_copies}</td>
                            <td>
                                {book.available_copies > 0
                                    ? "Available"
                                    : "Issued"}
                            </td>
                            <td>
                                <button
                                    onClick={() => generateQRCode(book.book_id)}
                                >
                                    Generate QR
                                </button>

                                {qrCodes[book.book_id] && (
                                    <div>
                                        <img
                                            src={qrCodes[book.book_id]}
                                            alt={`QR code for ${book.book_id}`}
                                            width="250"
                                        />
                                    </div>
                                )}
                        </td>
                            <td>
                                {qrCodes[book.book_id] && (
                                    <img src={qrCodes[book.book_id]} alt="QR Code" />
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Books;