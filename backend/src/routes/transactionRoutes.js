import express from "express";

import {
    issueBook,
    returnBook,
    getTransactions,
    getDashboardStats
} from "../controllers/transactionController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/issue", authenticate, issueBook);
router.post("/return", authenticate, returnBook);
router.get("/", authenticate, getTransactions);
router.get("/stats", authenticate, getDashboardStats);

export default router;