import express from "express";
import { createBook } from "../controllers/bookController.js";
import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authenticate, createBook);

export default router;