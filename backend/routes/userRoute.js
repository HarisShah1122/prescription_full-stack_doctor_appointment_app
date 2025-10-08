import express from 'express';
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';
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
    paymentRazorpay,
    verifyRazorpay,
    paymentStripe,
    verifyStripe
} from '../controllers/userController.js';


const userRouter = express.Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);

// Protected routes
userRouter.get("/get-profile", authUser, getProfile);
userRouter.post("/update-profile", authUser, upload.single('image'), updateProfile);
userRouter.post("/book-appointment", authUser, bookAppointment);
userRouter.get("/appointments", authUser, listAppointment);
userRouter.post("/cancel-appointment", authUser, cancelAppointment);
userRouter.post("/payment-easypaisa", authUser, paymentEasyPaisa);
userRouter.post("/payment-jazzcash", authUser, paymentJazzCash);
userRouter.post("/payment-stripe", authUser, paymentStripe);
userRouter.post("/verifyStripe", authUser, verifyStripe);

export default userRouter;
