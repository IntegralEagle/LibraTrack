import bcrypt from "bcryptjs";
import pool from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const seed = async () => {
    try {
        const password = "Libra@123";

        const passwordHash = await bcrypt.hash(password, 10);

        await pool.query(
            `
            INSERT INTO users (name, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING
            `,
            [
                "Library Admin",
                "admin@libratrack.com",
                passwordHash,
                "ADMIN"
            ]
        );
                await pool.query(
            `
            INSERT INTO users (name, email, password_hash, role)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (email) DO NOTHING
            `,
            [
                "Rahul Sharma",
                "rahul@example.com",
                "not-used-for-borrowing",
                "MEMBER"
            ]
        );

        console.log("Member user seeded successfully");

        console.log("Admin user seeded successfully");
        console.log("Email: admin@libratrack.com");
        console.log("Password: Libra@123");

    } catch (error) {
        console.error("Seed error:", error);
    } finally {
        await pool.end();
    }
};

seed();