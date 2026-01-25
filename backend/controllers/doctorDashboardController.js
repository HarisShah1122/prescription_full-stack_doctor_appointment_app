import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';

// Get doctor dashboard data
const getDoctorDashboard = async (req, res) => {
    try {
        const doctorId = req.userId;
        
        // Get doctor profile
        const doctor = await doctorModel.findById(doctorId).select('-password');
        if (!doctor) {
            return res.json({ success: false, message: 'Doctor not found' });
        }

        // Get today's appointments
        const today = new Date();
        const todayStr = `${today.getDate()}_${today.getMonth() + 1}_${today.getFullYear()}`;
        
        const appointments = await appointmentModel.find({ docId: doctorId })
            .populate('userId', 'name email phone')
            .sort({ date: -1 });

        // Calculate earnings
        const completedAppointments = appointments.filter(apt => !apt.cancelled && new Date(apt.slotDate) < new Date());
        const totalEarnings = completedAppointments.reduce((sum, apt) => sum + apt.amount, 0);
        const thisMonthEarnings = completedAppointments
            .filter(apt => new Date(apt.date).getMonth() === today.getMonth())
            .reduce((sum, apt) => sum + apt.amount, 0);

        // Get appointment statistics
        const totalAppointments = appointments.length;
        const completedCount = completedAppointments.length;
        const cancelledCount = appointments.filter(apt => apt.cancelled).length;
        const upcomingCount = appointments.filter(apt => !apt.cancelled && new Date(apt.slotDate) >= new Date()).length;

        // Get today's appointments
        const todayAppointments = appointments.filter(apt => apt.slotDate === todayStr && !apt.cancelled);

        res.json({
            success: true,
            dashboardData: {
                doctor,
                stats: {
                    totalAppointments,
                    completedCount,
                    cancelledCount,
                    upcomingCount,
                    totalEarnings,
                    thisMonthEarnings
                },
                todayAppointments,
                recentAppointments: appointments.slice(0, 10)
            }
        });
    } catch (error) {
        console.error('Dashboard error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Update doctor profile
const updateDoctorProfile = async (req, res) => {
    try {
        const doctorId = req.userId;
        const { name, speciality, degree, experience, about, fees, address } = req.body;

        const updateData = {
            name,
            speciality,
            degree,
            experience,
            about,
            fees,
            address
        };

        if (req.file) {
            updateData.image = req.file.filename;
        }

        const doctor = await doctorModel.findByIdAndUpdate(doctorId, updateData, { new: true });
        
        res.json({
            success: true,
            message: 'Profile updated successfully',
            doctor
        });
    } catch (error) {
        console.error('Profile update error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Update doctor availability/schedule
const updateDoctorSchedule = async (req, res) => {
    try {
        const doctorId = req.userId;
        const { available, workingHours } = req.body;

        const doctor = await doctorModel.findByIdAndUpdate(doctorId, {
            available,
            workingHours: workingHours || {
                monday: { start: '09:00', end: '20:00', available: true },
                tuesday: { start: '09:00', end: '20:00', available: true },
                wednesday: { start: '09:00', end: '20:00', available: true },
                thursday: { start: '09:00', end: '20:00', available: true },
                friday: { start: '09:00', end: '20:00', available: true },
                saturday: { start: '10:00', end: '18:00', available: true },
                sunday: { start: '10:00', end: '16:00', available: false }
            }
        }, { new: true });

        res.json({
            success: true,
            message: 'Schedule updated successfully',
            doctor
        });
    } catch (error) {
        console.error('Schedule update error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get doctor appointments with filters
const getDoctorAppointments = async (req, res) => {
    try {
        const doctorId = req.userId;
        const { status, date, page = 1, limit = 10 } = req.query;

        let query = { docId: doctorId };
        
        if (status === 'completed') {
            query.cancelled = false;
            query.date = { $lt: new Date() };
        } else if (status === 'upcoming') {
            query.cancelled = false;
            query.date = { $gte: new Date() };
        } else if (status === 'cancelled') {
            query.cancelled = true;
        }

        if (date) {
            query.slotDate = date;
        }

        const appointments = await appointmentModel.find(query)
            .populate('userId', 'name email phone age gender')
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await appointmentModel.countDocuments(query);

        res.json({
            success: true,
            appointments,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Appointments error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get patient details
const getPatientDetails = async (req, res) => {
    try {
        const { patientId } = req.params;
        const doctorId = req.userId;

        // Get patient information
        const patient = await userModel.findById(patientId).select('-password');
        if (!patient) {
            return res.json({ success: false, message: 'Patient not found' });
        }

        // Get patient's appointment history with this doctor
        const appointments = await appointmentModel.find({
            userId: patientId,
            docId: doctorId
        }).sort({ date: -1 });

        res.json({
            success: true,
            patient,
            appointments,
            medicalHistory: {
                totalVisits: appointments.length,
                lastVisit: appointments[0]?.date || null,
                conditions: [], // This could be expanded with actual medical records
                medications: [] // This could be expanded with actual medication records
            }
        });
    } catch (error) {
        console.error('Patient details error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get earnings data
const getDoctorEarnings = async (req, res) => {
    try {
        const doctorId = req.userId;
        const { period = 'month' } = req.query;

        const appointments = await appointmentModel.find({
            docId: doctorId,
            cancelled: false
        }).sort({ date: -1 });

        let earningsData = [];

        if (period === 'month') {
            // Last 6 months
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const today = new Date();
            
            for (let i = 5; i >= 0; i--) {
                const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
                const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
                
                const monthEarnings = appointments
                    .filter(apt => {
                        const aptDate = new Date(apt.date);
                        return aptDate >= monthStart && aptDate <= monthEnd;
                    })
                    .reduce((sum, apt) => sum + apt.amount, 0);

                earningsData.push({
                    month: months[monthDate.getMonth()],
                    year: monthDate.getFullYear(),
                    earnings: monthEarnings,
                    appointments: appointments.filter(apt => {
                        const aptDate = new Date(apt.date);
                        return aptDate >= monthStart && aptDate <= monthEnd;
                    }).length
                });
            }
        } else if (period === 'week') {
            // Last 4 weeks
            for (let i = 3; i >= 0; i--) {
                const weekStart = new Date();
                weekStart.setDate(weekStart.getDate() - (i * 7));
                weekStart.setHours(0, 0, 0, 0);
                
                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                weekEnd.setHours(23, 59, 59, 999);

                const weekEarnings = appointments
                    .filter(apt => {
                        const aptDate = new Date(apt.date);
                        return aptDate >= weekStart && aptDate <= weekEnd;
                    })
                    .reduce((sum, apt) => sum + apt.amount, 0);

                earningsData.push({
                    week: `Week ${4 - i}`,
                    startDate: weekStart.toISOString().split('T')[0],
                    endDate: weekEnd.toISOString().split('T')[0],
                    earnings: weekEarnings,
                    appointments: appointments.filter(apt => {
                        const aptDate = new Date(apt.date);
                        return aptDate >= weekStart && aptDate <= weekEnd;
                    }).length
                });
            }
        }

        const totalEarnings = appointments.reduce((sum, apt) => sum + apt.amount, 0);
        const thisMonthEarnings = earningsData[earningsData.length - 1]?.earnings || 0;

        res.json({
            success: true,
            earnings: {
                total: totalEarnings,
                thisMonth: thisMonthEarnings,
                data: earningsData
            }
        });
    } catch (error) {
        console.error('Earnings error:', error);
        res.json({ success: false, message: error.message });
    }
};

export {
    getDoctorDashboard,
    updateDoctorProfile,
    updateDoctorSchedule,
    getDoctorAppointments,
    getPatientDetails,
    getDoctorEarnings
};
