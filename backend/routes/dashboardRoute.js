import express from 'express';
import {
    getDashboardStats,
    getWeeklyData,
    getMonthlyRevenue,
    getDoctorStats,
    getRecentAppointments
} from '../controllers/dashboardController.js';
import authUser from '../middleware/authUser.js';

const router = express.Router();

// All dashboard routes require authentication
router.get('/stats', authUser, getDashboardStats);
router.get('/weekly', authUser, getWeeklyData);
router.get('/revenue', authUser, getMonthlyRevenue);
router.get('/doctors', authUser, getDoctorStats);
router.get('/recent', authUser, getRecentAppointments);

export default router;
