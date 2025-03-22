import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { Server } from "socket.io";
import http from "http";
import authRoutes from "./routes/authRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import bedRoutes from "./routes/bedRoutes.js";
import inventoryRoutes from "./routes/inventoryRoutes.js";
import queueRoutes from "./routes/queueRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import hospitalRoutes from "./routes/hospitalRoutes.js";


dotenv.config();

// Connect to Database
connectDB();

const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.io
const io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL || "*" },
});

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || "*", credentials: true }));
app.use(express.json());

// API Request Logger
app.use((req, res, next) => {
    console.log(`📩 [${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/beds", bedRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/queue", queueRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/hospitals", hospitalRoutes);

// Attach io instance to requests
app.use((req, res, next) => {
    req.io = io;
    next();
});

// 404 Error Handling
app.use((req, res) => {
    console.warn(`⚠️ 404 Not Found: ${req.originalUrl}`);
    res.status(404).json({ message: "Route Not Found" });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(`❌ [ERROR] ${err.message}`);
    res.status(500).json({
        message: "Internal Server Error",
        error: err.message,
    });
});

// WebSockets: Handle Client Connection
io.on("connection", (socket) => {
    console.log("🔵 New client connected");

    socket.on("disconnect", () => {
        console.log("🔴 Client disconnected");
    });
});

// Event Logging Example
io.on("userCreated", (data) => {
    console.log(`👤 User Created: ${JSON.stringify(data)}`);
});
io.on("appointmentBooked", (data) => {
    console.log(`📅 Appointment Booked: ${JSON.stringify(data)}`);
});
io.on("inventoryUpdated", (data) => {
    console.log(`📦 Inventory Updated: ${JSON.stringify(data)}`);
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));