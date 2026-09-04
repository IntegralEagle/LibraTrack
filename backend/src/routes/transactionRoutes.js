import express from "express";
import {
    issueBook,
    returnBook,
    getTransactions
} from "../controllers/transactionController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/issue", authenticate, issueBook);
router.post("/return", authenticate, returnBook);
router.get("/", authenticate, getTransactions);

export default router;