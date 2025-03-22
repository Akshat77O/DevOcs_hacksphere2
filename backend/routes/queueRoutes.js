import express from "express";
import {
    getUserQueueStatus,
    updateQueueItemStatus,
    getDepartmentWaitTimes,
    getQueueStatus
} from "../controllers/queueController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/queue/status", authMiddleware, getQueueStatus);
router.get("/queue/department", authMiddleware, getDepartmentWaitTimes);


router.get("/", authMiddleware, getUserQueueStatus);
router.put("/:id/status", authMiddleware, updateQueueItemStatus);

export default router;
