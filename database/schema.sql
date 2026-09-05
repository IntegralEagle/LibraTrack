-- ============================================
-- LibraTrack Database Schema
-- Library Book Issue & Return Management System
-- ============================================

-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'LIBRARIAN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT users_role_check
        CHECK (role IN ('LIBRARIAN', 'ADMIN', 'MEMBER'))
);


-- Books table
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    book_id VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(200) NOT NULL,
    author VARCHAR(150) NOT NULL,
    isbn VARCHAR(20),
    category VARCHAR(100) NOT NULL,
    total_copies INTEGER NOT NULL,
    available_copies INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT books_total_copies_check
        CHECK (total_copies > 0),

    CONSTRAINT books_available_copies_check
        CHECK (available_copies >= 0),

    CONSTRAINT books_available_not_more_than_total
        CHECK (available_copies <= total_copies)
);


-- Issue/Return transactions table
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,

    book_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,

    issued_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    due_at TIMESTAMP NOT NULL,
    returned_at TIMESTAMP,

    status VARCHAR(20) NOT NULL DEFAULT 'ISSUED',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT transactions_book_fk
        FOREIGN KEY (book_id)
        REFERENCES books(id)
        ON DELETE RESTRICT,

    CONSTRAINT transactions_user_fk
        FOREIGN KEY (user_id)
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT transactions_status_check
        CHECK (status IN ('ISSUED', 'RETURNED'))
);


-- Indexes for faster searching/filtering
CREATE INDEX idx_books_title
ON books(title);

CREATE INDEX idx_books_author
ON books(author);

CREATE INDEX idx_books_category
ON books(category);

CREATE INDEX idx_books_availability
ON books(available_copies);

CREATE INDEX idx_transactions_status
ON transactions(status);

CREATE INDEX idx_transactions_issued_at
ON transactions(issued_at);

