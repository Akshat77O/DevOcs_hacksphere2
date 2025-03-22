import express from "express";
import {
    getAppointments,
    createAppointment,
    cancelAppointment,
} from "../controllers/appointmentController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET /api/appointments - Get all appointments for the authenticated patient
router.get("/", authMiddleware, getAppointments);

// POST /api/appointments - Create a new appointment for the authenticated patient
router.post("/", authMiddleware, createAppointment);

// DELETE /api/appointments/:id - Cancel an appointment by ID
router.delete("/:id", authMiddleware, cancelAppointment);

export default router;
