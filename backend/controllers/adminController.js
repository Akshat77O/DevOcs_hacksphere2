import User from "../models/User.js";
import Bed from "../models/Bed.js";
import Appointment from "../models/Appointment.js";
import Inventory from "../models/Inventory.js";

export const getAdminStats = async (req, res) => {
    try {
        const totalPatients = await User.countDocuments({ role: "patient" });
        const availableBeds = await Bed.countDocuments({ status: "Available" });
        const totalAppointments = await Appointment.countDocuments();
        const lowStockItems = await Inventory.countDocuments({
            status: "Low Stock",
        });

        res.json({
            totalPatients,
            availableBeds,
            totalAppointments,
            lowStockItems,
        });
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve stats", error });
    }
};
