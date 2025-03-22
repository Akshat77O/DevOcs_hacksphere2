import express from "express";
import {
    getAllItems,
    createItem,
    updateItem,
    deleteItem,
} from "../controllers/inventoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getAllItems);
router.post("/", authMiddleware, createItem);
router.put("/:id", authMiddleware, updateItem);
router.delete("/:id", authMiddleware, deleteItem);

export default router;
