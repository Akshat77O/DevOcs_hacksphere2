import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    doctor: String,
    department: String,
    date: String,
    time: String,
    status: {
        type: String,
        enum: ["Scheduled", "Completed", "Cancelled"],
        default: "Scheduled",
    },
});

export default mongoose.model("Appointment", appointmentSchema);
