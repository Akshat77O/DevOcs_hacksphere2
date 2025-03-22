import mongoose from "mongoose";

const bedSchema = new mongoose.Schema({
    bedNumber: String,
    department: String,
    ward: String,
    status: {
        type: String,
        enum: ["Available", "Occupied", "Under Maintenance"],
        default: "Available",
    },
    patientName: { type: String, default: null },
    patientId: { type: String, default: null },
    admissionDate: { type: Date, default: null },
});

export default mongoose.model("Bed", bedSchema);
