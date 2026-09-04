import express from "express";
import { createBook, getBooks } from "../controllers/bookController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createBook);
router.get("/", authenticate, getBooks);

export default router;