import express from "express";
import cors from "cors";
import session from "express-session";
import cookieParser from "cookie-parser";
import "dotenv/config.js";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import doctorRouter from "./routes/doctorRoute.js";
import adminRouter from "./routes/adminRoute.js";
import doctorDashboardRouter from "./routes/doctorDashboardRoute.js";
import dashboardRouter from "./routes/dashboardRoute.js";

// Initialize App
const app = express();
const port = process.env.PORT || 4000;

// Connect to DB & Cloudinary
connectDB();
connectCloudinary();

// Session middleware for authentication
app.use(session({
  name: 'sessionId',
  secret: process.env.JWT_SECRET || 'fallback_session_secret',
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 60 * 60 * 1000, // 1 hour
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax' // Use lax in development
  }
}));

// Middleware
app.use(express.json());
app.use(cookieParser());

// Simple CORS configuration for credentials
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true
  })
);

// Request logging middleware
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.connection.remoteAddress;
  const method = req.method;
  const url = req.url;
  const origin = req.headers.origin;
  
  console.log(`🌐 [${timestamp}] ${method} ${url} - IP: ${ip} - Origin: ${origin || 'No origin'}`);
  next();
});

// Routes
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/doctor", doctorRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/doctor", doctorDashboardRouter);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0'
  });
});

// Root
app.get("/", (req, res) => res.send("✅ API Working — Appointment System Server"));

// Start
app.listen(port, () =>
  console.log(`🚀 Server running in ${process.env.NODE_ENV || "development"} mode on PORT: ${port}`)
);
