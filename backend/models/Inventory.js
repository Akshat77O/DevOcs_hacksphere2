import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
    id: Number,
    name: String,
    category: String,
    currentStock: Number,
    minimumStock: Number,
    unit: String,
    expiryDate: String,
    supplierName: String,
    status: {
        type: String,
        enum: ["In Stock", "Low Stock", "Out of Stock"],
        default: "In Stock",
    },
});

export default mongoose.model("Inventory", inventorySchema);
