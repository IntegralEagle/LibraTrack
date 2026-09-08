# Task 1 — Library Book Issue & Return Management System

## Project

**LibraTrack** is a full-stack Library Book Issue & Return Management System developed for the **NSCC SRM Technical Domain recruitment task**.

The system allows librarians to manage books, generate and scan QR codes, issue and return books, track availability, maintain complete transaction history, and monitor currently issued and overdue books.

---

## Live Deployment

**Frontend:**  
https://libra-track-1zlj.vercel.app/

**Backend API:**  
https://libra-track-orpin.vercel.app/

---

## Demo Credentials

Use these credentials to test the deployed application:

- **Email:** `demo@libratrack.com`
- **Password:** `Demo@123`

The demo account has **librarian access** to the Library Management System.

---

## GitHub Repository

https://github.com/IntegralEagle/LibraTrack

---

## Features

### Authentication
- Librarian authentication using JWT
- Protected application routes
- Secure password hashing using bcryptjs

### Book Management
- Add new books
- Store Book ID, title, author, ISBN, category, and total copies
- Track total and available copies
- Search books by title or author
- Filter books by category and availability

### QR Code Management
- Generate a unique QR code for every book
- QR code contains the Book ID
- Scan book QR codes using a device camera
- Validate scanned Book IDs through the backend

### Issue & Return
- Issue books using QR scanning
- Return books using QR scanning
- Select borrower during issue
- Set book due date
- Prevent issuing books when no copies are available
- Automatically update available copies
- Store issue and return timestamps
- Store borrower information

### Transaction Management
- Complete issue/return history
- View transaction status
- Search and filter transactions
- Track currently issued books
- Track overdue books
- Calculate days overdue

### Dashboard
- Total Books
- Available Books
- Issued Books
- Overdue Books
- Currently issued books
- Borrower details
- Due dates
- Days overdue

### Reports
- Export complete transaction history as CSV
- Export includes:
  - Book Title
  - Author
  - Book ID
  - Issued To
  - Issue Timestamp
  - Return Timestamp
  - Current Status

### Responsive UI
- Desktop-friendly interface
- Mobile-responsive layout
- Responsive navigation
- Mobile-friendly forms
- Horizontally scrollable data tables on small screens
- Subtle UI animations using Motion

---

## Technology Stack

### Frontend
- React
- Vite
- React Router
- Axios
- Motion
- html5-qrcode

### Backend
- Node.js
- Express.js
- JWT
- bcryptjs
- pg
- qrcode

### Database
- PostgreSQL
- Neon PostgreSQL

### Deployment
- Vercel
- Neon PostgreSQL

---

## Architecture

```text
                    LibraTrack
                        |
                        v
              React + Vite Frontend
                        |
                        | REST API / Axios
                        v
              Node.js + Express Backend
                        |
                        | SQL / pg
                        v
                PostgreSQL Database
                   (Neon PostgreSQL)