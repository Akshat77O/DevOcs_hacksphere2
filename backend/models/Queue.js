import mongoose from "mongoose";

const queueSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    patientName: String,
    department: String,
    doctor: String,
    arrivalTime: String,
    estimatedWaitTime: String,
    status: {
        type: String,
        enum: ["Waiting", "In Progress", "Completed", "Cancelled"],
        default: "Waiting",
    },
});

export default mongoose.model("Queue", queueSchema);
