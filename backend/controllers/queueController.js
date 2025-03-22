import Queue from "../models/Queue.js";

export const getQueueStatus = async (req, res) => {
    try {
        const queueStatus = await Queue.findOne({ userId: req.user.id });
        res.json(queueStatus || {});
    } catch (error) {
        console.error("Error fetching queue status:", error);
        res.status(500).json({ message: "Failed to fetch queue status" });
    }
};

export const getDepartmentWaitTimes = async (req, res) => {
    try {
        const departmentWaitTimes = await Queue.find();
        res.json(departmentWaitTimes);
    } catch (error) {
        console.error("Error fetching department wait times:", error);
        res.status(500).json({
            message: "Failed to fetch department wait times",
        });
    }
};

export const getUserQueueStatus = async (req, res) => {
    try {
        const queueStatus = await Queue.find();
        res.json(queueStatus);
    } catch (error) {
        res.status(500).json({ message: "Error fetching queue status", error });
    }
};

export const updateQueueItemStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const queueItem = await Queue.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!queueItem) {
            return res.status(404).json({ message: "Queue item not found" });
        }

        // Emit WebSocket update
        req.io.emit("queueUpdated", await Queue.find());

        res.json(queueItem);
    } catch (error) {
        res.status(500).json({ message: "Error updating queue status", error });
    }
};
