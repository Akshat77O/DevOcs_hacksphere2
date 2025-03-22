import express from "express";
import { getAdminStats } from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/stats", authMiddleware, getAdminStats);

export default router;
