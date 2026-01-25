import express from 'express';
import upload from '../middleware/multer.js';
import authDoctor from '../middleware/authDoctor.js';
import {
    getDoctorDashboard,
    updateDoctorProfile,
    updateDoctorSchedule,
    getDoctorAppointments,
    getPatientDetails,
    getDoctorEarnings
} from '../controllers/doctorDashboardController.js';

const doctorDashboardRouter = express.Router();

// All routes are protected and require doctor authentication
doctorDashboardRouter.use(authDoctor);

// Dashboard endpoints
doctorDashboardRouter.get('/dashboard', getDoctorDashboard);
doctorDashboardRouter.get('/appointments', getDoctorAppointments);
doctorDashboardRouter.get('/earnings', getDoctorEarnings);
doctorDashboardRouter.get('/patient/:patientId', getPatientDetails);

// Profile management
doctorDashboardRouter.post('/update-profile', upload.single('image'), updateDoctorProfile);
doctorDashboardRouter.post('/update-schedule', updateDoctorSchedule);

export default doctorDashboardRouter;
