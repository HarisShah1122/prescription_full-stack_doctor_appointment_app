import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config.js";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import doctorDashboardRouter from "./routes/doctorDashboardRoute.js";

// Initialize App
const app = express();
const port = process.env.PORT || 4000;

// Connect to DB & Cloudinary
connectDB();
connectCloudinary();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: ["http://localhost:5173"], // frontend URL
    credentials: true,
  })
);

// Routes
app.use("/api/user", userRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/doctor", doctorDashboardRouter); // Dashboard routes under doctor
app.use("/api/admin", adminRouter);

// Root
app.get("/", (req, res) => res.send("✅ API Working — Appointment System Server"));

// Start
app.listen(port, () =>
  console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on PORT: ${port}`)
);
