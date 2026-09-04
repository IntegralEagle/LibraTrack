import pool from "../config/db.js";

export const issueBook = async (req, res) => {
    try {
        const { book_id, user_id, due_at } = req.body;

        // Validate input
        if (!book_id || !user_id || !due_at) {
            return res.status(400).json({
                success: false,
                message: "Book ID, user ID and due date are required"
            });
        }

        // Start transaction
        await pool.query("BEGIN");

        // Find and lock the book row
        const bookResult = await pool.query(
            `SELECT *
             FROM books
             WHERE book_id = $1
             FOR UPDATE`,
            [book_id]
        );

        if (bookResult.rows.length === 0) {
            await pool.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Book not found"
            });
        }

        const book = bookResult.rows[0];

        // Check availability
        if (book.available_copies <= 0) {
            await pool.query("ROLLBACK");

            return res.status(409).json({
                success: false,
                message: "Book is currently unavailable"
            });
        }

        // Check borrower exists
        const userResult = await pool.query(
            `SELECT id, name, email
             FROM users
             WHERE id = $1 AND role = 'MEMBER'`,
            [user_id]
        );

        if (userResult.rows.length === 0) {
            await pool.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Borrower not found"
            });
        }

        // Create issue transaction
        const transactionResult = await pool.query(
            `INSERT INTO transactions
             (book_id, user_id, due_at, status)
             VALUES ($1, $2, $3, 'ISSUED')
             RETURNING *`,
            [book.id, user_id, due_at]
        );

        // Reduce available copies
        await pool.query(
            `UPDATE books
             SET available_copies = available_copies - 1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [book.id]
        );

        await pool.query("COMMIT");

        res.status(201).json({
            success: true,
            message: "Book issued successfully",
            transaction: transactionResult.rows[0]
        });

    } catch (error) {
        await pool.query("ROLLBACK");

        console.error("Issue book error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to issue book"
        });
    }
};
export const returnBook = async (req, res) => {
    try {
        const { transaction_id } = req.body;

        if (!transaction_id) {
            return res.status(400).json({
                success: false,
                message: "Transaction ID is required"
            });
        }

        await pool.query("BEGIN");

        // Find and lock the active transaction
        const transactionResult = await pool.query(
            `SELECT *
             FROM transactions
             WHERE id = $1 AND status = 'ISSUED'
             FOR UPDATE`,
            [transaction_id]
        );

        if (transactionResult.rows.length === 0) {
            await pool.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Active transaction not found"
            });
        }

        const transaction = transactionResult.rows[0];

        // Mark transaction as returned
        const updatedTransaction = await pool.query(
            `UPDATE transactions
             SET returned_at = CURRENT_TIMESTAMP,
                 status = 'RETURNED'
             WHERE id = $1
             RETURNING *`,
            [transaction_id]
        );

        // Increase available copies
        await pool.query(
            `UPDATE books
             SET available_copies = available_copies + 1,
                 updated_at = CURRENT_TIMESTAMP
             WHERE id = $1`,
            [transaction.book_id]
        );

        await pool.query("COMMIT");

        res.json({
            success: true,
            message: "Book returned successfully",
            transaction: updatedTransaction.rows[0]
        });

    } catch (error) {
        await pool.query("ROLLBACK");

        console.error("Return book error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to return book"
        });
    }
};
export const getTransactions = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT
                t.id,
                b.book_id,
                b.title,
                b.author,
                u.id AS borrower_id,
                u.name AS borrower_name,
                u.email AS borrower_email,
                t.issued_at,
                t.due_at,
                t.returned_at,
                t.status
             FROM transactions t
             JOIN books b ON t.book_id = b.id
             JOIN users u ON t.user_id = u.id
             ORDER BY t.issued_at DESC`
        );

        res.json({
            success: true,
            transactions: result.rows
        });

    } catch (error) {
        console.error("Get transactions error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch transactions"
        });
    }
};
export const getDashboardStats = async (req, res) => {
    try {
        const totalResult = await pool.query(
            `SELECT COALESCE(SUM(total_copies), 0) AS total_books
             FROM books`
        );

        const availableResult = await pool.query(
            `SELECT COALESCE(SUM(available_copies), 0) AS available_books
             FROM books`
        );

        const issuedResult = await pool.query(
            `SELECT COUNT(*) AS issued_books
             FROM transactions
             WHERE status = 'ISSUED'`
        );

        const overdueResult = await pool.query(
            `SELECT COUNT(*) AS overdue_books
             FROM transactions
             WHERE status = 'ISSUED'
             AND due_at < CURRENT_TIMESTAMP`
        );

        res.json({
            success: true,
            stats: {
                totalBooks: Number(totalResult.rows[0].total_books),
                availableBooks: Number(availableResult.rows[0].available_books),
                issuedBooks: Number(issuedResult.rows[0].issued_books),
                overdueBooks: Number(overdueResult.rows[0].overdue_books)
            }
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch dashboard statistics"
        });
    }
};