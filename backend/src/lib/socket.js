import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
});
export function getRecieverSockcetId(userId) {
    return userSocketMap[userId];
}
const userSocketMap = {};

function parseCookies(cookieHeader = "") {
    return cookieHeader.split(";").reduce((acc, part) => {
        const [k, ...v] = part.trim().split("=");
        if (!k) return acc;
        acc[k] = decodeURIComponent(v.join("="));
        return acc;
    }, {});
}

// Authenticate socket using JWT from cookies
io.use((socket, next) => {
    try {
        const cookieHeader = socket.handshake.headers?.cookie || "";
        const cookies = parseCookies(cookieHeader);
        const token = cookies?.jwt;
        if (!token) return next(new Error("Unauthorized"));
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (!decoded?.userId) return next(new Error("Unauthorized"));
        socket.userId = decoded.userId;
        next();
    } catch (err) {
        console.error("Socket auth error:", err?.message);
        next(new Error("Unauthorized"));
    }
});

io.on("connection", (socket) => {
    console.log("New user connected", socket.id);
    const userId = socket.userId;
    if (userId) {
        userSocketMap[userId] = socket.id;
    }

    io.emit("getOnlineUsers", Object.keys(userSocketMap));

    // Typing indicator
    socket.on("typing", ({ to, isTyping }) => {
        if (!userId || !to) return;
        const receiverSocketId = userSocketMap[to];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("typing", { from: userId, isTyping: !!isTyping });
        }
    });

    // Read receipts
    socket.on("message:read", async ({ ids = [], with: withUser }) => {
        try {
            if (!userId || !withUser || !ids.length) return;
            await Message.updateMany(
                { _id: { $in: ids }, recieverId: userId, senderId: withUser, readAt: { $exists: false } },
                { $set: { readAt: new Date() } }
            );
            const receiverSocketId = userSocketMap[withUser];
            if (receiverSocketId) io.to(receiverSocketId).emit("message:read", { ids });
        } catch (err) {
            console.error("Error handling message:read", err?.message);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        if (userId) delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});
export {io,app,server};