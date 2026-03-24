import express from 'express';
import { 
    loginAdmin, 
    appointmentsAdmin, 
    appointmentCancel, 
    addDoctor, 
    allDoctors, 
    adminDashboard,
    getAnalytics,
    manageUsers,
    manageDoctors,
    getSystemSettings,
    updateSystemSettings
} from '../controllers/adminController.js';
import { changeAvailablity } from '../controllers/doctorController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
const adminRouter = express.Router();

// Authentication
adminRouter.post("/login", loginLimiter, loginAdmin)

// Doctor management
adminRouter.post("/add-doctor", authAdmin, upload.single('image'), addDoctor)
adminRouter.get("/all-doctors", authAdmin, allDoctors)
adminRouter.post("/change-availability", authAdmin, changeAvailablity)
adminRouter.get("/manage-doctors", authAdmin, manageDoctors)

// Appointment management
adminRouter.get("/appointments", authAdmin, appointmentsAdmin)
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel)

// User management
adminRouter.get("/manage-users", authAdmin, manageUsers)

// Dashboard and analytics
adminRouter.get("/dashboard", authAdmin, adminDashboard)
adminRouter.get("/analytics", authAdmin, getAnalytics)

// System settings
adminRouter.get("/settings", authAdmin, getSystemSettings)
adminRouter.post("/settings", authAdmin, updateSystemSettings)

export default adminRouter;