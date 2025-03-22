import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, enum: ["staff", "patient"], default: "patient" },
    phone: String,
    address: String,
    bloodType: String,
    emergencyContact: String,
    dateOfBirth: String,
    specialization: String,
    hospital: String,
});

export default mongoose.model("User", userSchema);