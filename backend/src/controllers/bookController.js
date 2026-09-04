import pool from "../config/db.js";

export const createBook = async (req, res) => {
    try {
        const {
            book_id,
            title,
            author,
            isbn,
            category,
            total_copies
        } = req.body;

        if (!book_id || !title || !author || !isbn || !category || !total_copies) {
            return res.status(400).json({
                success: false,
                message: "All book fields are required"
            });
        }

        if (total_copies < 1) {
            return res.status(400).json({
                success: false,
                message: "Total copies must be at least 1"
            });
        }

        const result = await pool.query(
            `INSERT INTO books
            (book_id, title, author, isbn, category, total_copies, available_copies)
            VALUES ($1, $2, $3, $4, $5, $6, $6)
            RETURNING *`,
            [
                book_id,
                title,
                author,
                isbn,
                category,
                total_copies
            ]
        );

        res.status(201).json({
            success: true,
            message: "Book added successfully",
            book: result.rows[0]
        });

    } catch (error) {
        console.error("Create book error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add book"
        });
    }
};
export const getBooks = async (req, res) => {
    try {
        const { search, category, availability } = req.query;

        let query = `
            SELECT *
            FROM books
            WHERE 1=1
        `;

        const values = [];
        let paramIndex = 1;

        // Search by title or author
        if (search) {
            query += `
                AND (
                    title ILIKE $${paramIndex}
                    OR author ILIKE $${paramIndex}
                )
            `;
            values.push(`%${search}%`);
            paramIndex++;
        }

        // Filter by category
        if (category) {
            query += ` AND category ILIKE $${paramIndex}`;
            values.push(category);
            paramIndex++;
        }

        // Filter by availability
        if (availability === "available") {
            query += ` AND available_copies > 0`;
        }

        if (availability === "issued") {
            query += ` AND available_copies = 0`;
        }

        query += ` ORDER BY created_at DESC`;

        const result = await pool.query(query, values);

        res.json({
            success: true,
            books: result.rows
        });

    } catch (error) {
        console.error("Get books error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch books"
        });
    }
};