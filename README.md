# LibraTrack

LibraTrack is a full-stack Library Book Issue & Return Management System built for managing books, QR-based issuing and returning, borrowers, and transaction history.

## Features

- Librarian authentication using JWT
- Add and manage library books
- Store Book Title, Author, ISBN/Book ID, Category, and Total Copies
- Generate a QR code for every book
- Scan book QR codes using a device camera
- Issue books using QR scanning
- Return books using QR scanning
- Track available and issued copies
- Prevent issuing unavailable books
- Maintain complete issue/return history
- Store borrower and timestamp information
- Search books by title, author, and category
- Filter books by availability
- Dashboard with:
  - Total Books
  - Available Books
  - Issued Books
  - Overdue Books
- View currently issued books with borrower details
- Calculate overdue days
- Search and filter transactions
- Export issue/return history as CSV
- PostgreSQL database with seed data

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- html5-qrcode
- qrcode

### Backend
- Node.js
- Express.js
- JWT
- bcryptjs
- PostgreSQL
- pg

### Deployment
- Frontend: Vercel
- Backend: Vercel
- Database: Neon PostgreSQL

## Architecture

```text
React Frontend
      |
      | REST API
      v
Node.js + Express Backend
      |
      | SQL
      v
PostgreSQL Database