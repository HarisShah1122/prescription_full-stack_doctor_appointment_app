import express from "express";
import cors from "cors";
import "dotenv/config.js";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";

// App Config
const app = express();
const port = process.env.PORT || 4000;

// Connect Database & Cloudinary
connectDB();
connectCloudinary();

// Middlewares
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"], 
    credentials: true,
  })
);

// API Endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);

// Root Route
app.get("/", (req, res) => {
  res.send("API Working ✅");
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on PORT: ${port}`);
});
