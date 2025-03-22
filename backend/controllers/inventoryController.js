import Inventory from "../models/Inventory.js";

export const getAllItems = async (req, res) => {
    const items = await Inventory.find();
    res.json(items);
};

export const createItem = async (req, res) => {
    try {
        const newItem = await Inventory.create(req.body);
        res.json(newItem);
    } catch (error) {
        res.status(500).json({ message: "Creation failed", error });
    }
};

export const updateItem = async (req, res) => {
    try {
        const updatedItem = await Inventory.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: "Update failed", error });
    }
};

export const deleteItem = async (req, res) => {
    try {
        await Inventory.findByIdAndDelete(req.params.id);
        res.json({ message: "Item deleted" });
    } catch (error) {
        res.status(500).json({ message: "Deletion failed", error });
    }
};
