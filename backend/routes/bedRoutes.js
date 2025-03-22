import express from "express";
import {
    getAllBeds,
    getBedSummary,
    updateBedStatus,
    addOrUpdateBed,
} from "../controllers/bedController.js";
import authMiddleware from "../middlewares/authMiddleware.js"; // Assuming you want to add auth middleware for certain routes

const router = express.Router();

// Routes for bed management
router.get("/", authMiddleware, getAllBeds); // Fetch all beds
router.get("/summary", authMiddleware, getBedSummary); // Get summary of beds
router.put("/status", authMiddleware, updateBedStatus); // Update the status of a bed
router.post("/", authMiddleware, addOrUpdateBed); // Add or update a bed

export default router;