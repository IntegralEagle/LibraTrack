import express from "express";
import {
    login,
    getMembers
} from "../controllers/authController.js";import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.get("/members", authenticate, getMembers);

router.get("/me", authenticate, (req, res) => {
    res.json({
        success: true,
        message: "Protected route accessed successfully",
        user: req.user
    });
});

export default router;