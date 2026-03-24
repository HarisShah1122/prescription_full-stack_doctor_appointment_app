import express from 'express';
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import {
  loginUser,
  registerUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentEasyPaisa,
  paymentJazzCash,
  paymentStripe,
  verifyStripe,
} from '../controllers/userController.js';
import { getAIResponse, getAvailableDoctors } from '../controllers/aiController.js';

const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginLimiter, loginUser);

// Protected routes
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", authUser, upload.single("image"), updateProfile);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);

// Payment routes
userRouter.post("/payment-easypaisa", authUser, paymentEasyPaisa);
userRouter.post("/payment-jazzcash", authUser, paymentJazzCash);
userRouter.post("/payment-stripe", authUser, paymentStripe);
userRouter.post("/verify-stripe", authUser, verifyStripe);

// AI Assistant routes
userRouter.post("/ai-chat", getAIResponse);
userRouter.get("/available-doctors", getAvailableDoctors);

export default userRouter;
