import express from "express";
import {
    login,
    signup,
    getUserProfile,
    updateUserProfile,
} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.get("/profile", authMiddleware, getUserProfile);
router.put("/profile", authMiddleware, updateUserProfile);

export default router;
