import pg from "pg";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config({ path: "../backend/.env" });

const { Pool } = pg;

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

const seed = async () => {
    try {
        const adminPassword = await bcrypt.hash(
            "Libra@123",
            10
        );

        await pool.query(
            `INSERT INTO users
             (name, email, password_hash, role)
             VALUES ($1, $2, $3, 'ADMIN')
             ON CONFLICT (email) DO NOTHING`,
            [
                "Library Admin",
                "admin@libratrack.com",
                adminPassword
            ]
        );

        await pool.query(
            `INSERT INTO users
             (name, email, password_hash, role)
             VALUES ($1, $2, $3, 'MEMBER')
             ON CONFLICT (email) DO NOTHING`,
            [
                "Rahul Sharma",
                "rahul@example.com",
                "not-used-for-borrowing"
            ]
        );

        console.log("Seed data inserted successfully.");
    } catch (error) {
        console.error("Seed error:", error);
    } finally {
        await pool.end();
    }
};

seed();