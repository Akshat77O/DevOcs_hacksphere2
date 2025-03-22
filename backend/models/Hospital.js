import mongoose from "mongoose";

const hospitalSchema = new mongoose.Schema({
    name: String,
    location: String,
    totalBeds: Number,
    availableBeds: Number,
});

export default mongoose.model("Hospital", hospitalSchema);
