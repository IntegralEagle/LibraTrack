# Task 1 — Library Book Issue & Return Management System

## Project

LibraTrack is a full-stack Library Book Issue & Return Management System developed for the NSCC SRM Technical Domain recruitment task.

## Live Deployment

**Frontend:**  
https://libra-track-1zlj.vercel.app/

**Backend API:**  
https://libra-track-orpin.vercel.app/

## GitHub Repository

https://github.com/IntegralEagle/LibraTrack

## Features

- Librarian authentication using JWT
- Add and manage books
- Generate QR codes for books
- Scan book QR codes using a device camera
- Issue books using QR scanning
- Return books using QR scanning
- Track available and issued copies
- Prevent issuing unavailable books
- Store borrower and timestamp information
- Complete issue/return transaction history
- Search and filter books
- Dashboard with book and issue statistics
- Overdue book tracking
- Currently issued books with borrower details
- Export transaction history as CSV

## Technology Stack

- React + Vite
- Node.js + Express
- PostgreSQL
- Axios
- JWT
- bcryptjs
- html5-qrcode
- qrcode
- Vercel
- Neon PostgreSQL

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