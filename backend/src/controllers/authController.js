import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../config/db.js";

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        // Find user by email
        const result = await pool.query(
            "SELECT id, name, email, password_hash, role FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        // Compare password with stored hash
        const passwordMatch = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        // Create JWT token
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1d"
            }
        );

        // Send response
        res.json({
            success: true,
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("Login error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};
export const getMembers = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT id, name, email
             FROM users
             WHERE role = 'MEMBER'
             ORDER BY name`
        );

        res.json({
            success: true,
            members: result.rows
        });

    } catch (error) {
        console.error("Get members error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch borrowers"
        });
    }
};
export const createMember = async (req, res) => {
    try {
        const { name, email } = req.body;

        if (!name || !email) {
            return res.status(400).json({
                success: false,
                message: "Name and email are required"
            });
        }

        const passwordHash = await bcrypt.hash(
            "member-account-no-login",
            10
        );

        const result = await pool.query(
            `INSERT INTO users
             (name, email, password_hash, role)
             VALUES ($1, $2, $3, 'MEMBER')
             RETURNING id, name, email, role`,
            [name, email, passwordHash]
        );

        res.status(201).json({
            success: true,
            message: "Borrower added successfully",
            member: result.rows[0]
        });
    } catch (error) {
        console.error("Create member error:", error);

        if (error.code === "23505") {
            return res.status(409).json({
                success: false,
                message: "A borrower with this email already exists"
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to add borrower"
        });
    }
};
