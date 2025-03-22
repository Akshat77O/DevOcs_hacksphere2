import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
    name: String,
    specialization: String,
    hospital: String,
    availableSlots: [String], // Example: ["10:00 AM", "2:00 PM"]
});

export default mongoose.model("Doctor", doctorSchema);
