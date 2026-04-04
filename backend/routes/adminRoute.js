import express from 'express';
import { 
    loginAdmin, 
    addDoctor, 
    allDoctors, 
    adminDashboard,
    getAnalytics,
    manageUsers,
    manageDoctors,
    getSystemSettings,
    updateSystemSettings,
    createDoctor,
    updateDoctor
} from '../controllers/adminController.js';
import authAdmin from '../middleware/authAdmin.js';
import upload from '../middleware/multer.js';
const adminRouter = express.Router();

// Authentication
adminRouter.post("/login", loginAdmin)

// Doctor management
adminRouter.post("/add-doctor", authAdmin, upload.single('image'), addDoctor)
adminRouter.get("/all-doctors", authAdmin, allDoctors)
adminRouter.get("/manage-doctors", authAdmin, manageDoctors)

// Dashboard
adminRouter.get("/dashboard", authAdmin, adminDashboard)
adminRouter.get("/analytics", authAdmin, getAnalytics)
adminRouter.get("/users", authAdmin, manageUsers)
adminRouter.get("/settings", authAdmin, getSystemSettings)
adminRouter.post("/settings", authAdmin, updateSystemSettings)

export default adminRouter;