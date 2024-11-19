import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();
// routes
import authRouter from "./routes/authRoute.js";
import categoryRouter from "./routes/categoryRoute.js";
import gigRouter from "./routes/gigRouter.js";
import paymentRoutes from "./routes/payment.js";
import thumbRouter from "./routes/thumbRoute.js";
import brandsRouter from "./routes/brandsRoute.js";
import personRouter from "./routes/personRoute.js";
import orderRouter from "./routes/orderRoute.js";
// socket
import { server } from "./socket/index.js";
import { app } from "./socket/index.js";
app.use(
  cors({
    origin: process.env.FRONTENDURL,
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());

// mongo connection
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_KEY);
    console.log(`MongoDB start: ${conn.connection.host}`);
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
connectDB();

// middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error!";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Health check route
app.get("/api/health-check", (req, res) => {
  res.status(200).json({ status: "Server is up and running" });
});

// routers
app.use("/api/auth", authRouter);
app.use("/api/category", categoryRouter);
app.use("/api/gig", gigRouter);
app.use("/payment", paymentRoutes);
app.use("/api/thumb", thumbRouter);
app.use("/api/brand", brandsRouter);
app.use("/api/person", personRouter);
app.use("/api/order", orderRouter);

server.listen(8000, () => {
  console.log("server is start");
});
