import Appointment from "../models/Appointment.js";

export const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user.id });
        res.json(appointments);
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).json({ message: "Failed to load appointments" });
    }
};

export const createAppointment = async (req, res) => {
    const { doctorId, hospitalId, date, time } = req.body;
    try {
        const newAppointment = new Appointment({
            patientId: req.user.id,
            doctorId,
            hospitalId,
            date,
            time,
        });
        await newAppointment.save();
        res.status(201).json(newAppointment);
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ message: "Failed to book appointment" });
    }
};

export const cancelAppointment = async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: "Appointment cancelled" });
    } catch (error) {
        console.error("Error cancelling appointment:", error);
        res.status(500).json({ message: "Failed to cancel appointment" });
    }
};
