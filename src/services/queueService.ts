import { api } from "./api";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

export const listenToQueueUpdates = (callback: (data: any) => void) => {
    socket.on("queueUpdated", callback);
};

export const stopListening = () => {
    socket.off("queueUpdated");
};

export interface QueueStatus {
    id: string;
    position: number;
    department: string;
    estimatedWaitTime: string;
    peopleAhead: number;
    doctor: string;
}

export interface DepartmentWaitTime {
    department: string;
    averageWaitTime: string;
    waitTimeMinutes: number;
    capacity: number;
}

export const queueService = {
    getUserQueueStatus: () => api.get("/queue/status"),

    getDepartmentWaitTimes: () => api.get("/queue/department-wait-times"),

    joinQueue: (departmentId: string, doctorId?: string) =>
        api.post("/queue/join", { departmentId, doctorId }),

    leaveQueue: () => api.post("/queue/leave", {}),
};

export const updateUserQueueStatus = async (id: string, status: string) => {
    const response = await fetch(
        `http://localhost:5000/api/queue/${id}/status`,
        {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update queue status");
    }

    return response.json();
};

export const emitQueueUpdate = () => {
    socket.emit("updateQueue");
};


