import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";

import { connectDB } from "./lib/db.js";
import { app,server } from "./lib/socket.js";

dotenv.config();

const PORT = process.env.PORT;
const __dirname = path.resolve();

// Increase body size limit for both JSON and URL-encoded payloads
app.use(express.json({ limit: '50mb' }));  // Increase limit for JSON payloads
app.use(express.urlencoded({ limit: '50mb', extended: true }));  // Increase limit for URL-encoded data
app.use(cookieParser());

app.use(cors({
  origin: "http://localhost:5173",  // Adjust this for your frontend
  credentials: true
}));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if(process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../frontend","dist","index.html"));
  });
}

// Start the server
server.listen(PORT, () => {
  console.log("Server is running on port: " + PORT);
  connectDB();
});
