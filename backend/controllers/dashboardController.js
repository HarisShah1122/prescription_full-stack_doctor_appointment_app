import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
    try {
        console.log('📊 Fetching dashboard statistics...');
        
        // Get all appointments
        const allAppointments = await appointmentModel.find({});
        
        // Get today's appointments
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        const todayAppointments = allAppointments.filter(apt => {
            const aptDate = new Date(apt.date);
            return aptDate >= today && aptDate < tomorrow;
        });
        
        // Calculate statistics
        const stats = {
            totalAppointments: allAppointments.length,
            todayAppointments: todayAppointments.length,
            completedAppointments: allAppointments.filter(apt => !apt.cancelled).length,
            cancelledAppointments: allAppointments.filter(apt => apt.cancelled).length,
            totalRevenue: allAppointments
                .filter(apt => !apt.cancelled)
                .reduce((sum, apt) => sum + (apt.amount || 0), 0),
            activeDoctors: await doctorModel.countDocuments({ active: true }),
            totalUsers: await userModel.countDocuments({}),
            pendingAppointments: allAppointments.filter(apt => !apt.cancelled && new Date(apt.slotDate) >= new Date()).length
        };
        
        console.log('✅ Dashboard stats calculated:', stats);
        
        res.json({
            success: true,
            stats
        });
        
    } catch (error) {
        console.error('❌ Dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics'
        });
    }
};

// Get weekly appointment data
const getWeeklyData = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const weekData = days.map(day => ({
            day,
            appointments: 0,
            completed: 0,
            cancelled: 0
        }));

        appointments.forEach(apt => {
            const date = new Date(apt.date);
            const dayName = days[date.getDay() === 0 ? 6 : date.getDay() - 1];
            const dayData = weekData.find(d => d.day === dayName);
            if (dayData) {
                dayData.appointments++;
                if (apt.cancelled) {
                    dayData.cancelled++;
                } else {
                    dayData.completed++;
                }
            }
        });

        res.json({
            success: true,
            weeklyData
        });
        
    } catch (error) {
        console.error('❌ Weekly data error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch weekly data'
        });
    }
};

// Get monthly revenue data
const getMonthlyRevenue = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({ cancelled: false });
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();
        
        const monthlyData = months.map((month, index) => {
            const monthAppointments = appointments.filter(apt => {
                const aptDate = new Date(apt.date);
                return aptDate.getMonth() === index && aptDate.getFullYear() === currentYear;
            });
            
            const revenue = monthAppointments.reduce((sum, apt) => sum + (apt.amount || 0), 0);
            
            return {
                month,
                revenue
            };
        });

        res.json({
            success: true,
            monthlyData
        });
        
    } catch (error) {
        console.error('❌ Monthly revenue error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch monthly revenue data'
        });
    }
};

// Get doctor performance data
const getDoctorStats = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({});
        const doctors = await doctorModel.find({});
        
        const doctorStats = doctors.map(doctor => {
            const doctorAppointments = appointments.filter(apt => 
                apt.docData?.name === doctor.name || apt.docId === doctor._id.toString()
            );
            
            return {
                name: doctor.name,
                totalAppointments: doctorAppointments.length,
                completedAppointments: doctorAppointments.filter(apt => !apt.cancelled).length,
                cancelledAppointments: doctorAppointments.filter(apt => apt.cancelled).length,
                revenue: doctorAppointments.filter(apt => !apt.cancelled).reduce((sum, apt) => sum + (apt.amount || 0), 0)
            };
        });

        res.json({
            success: true,
            doctorStats
        });
        
    } catch (error) {
        console.error('❌ Doctor stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctor statistics'
        });
    }
};

// Get recent appointments
const getRecentAppointments = async (req, res) => {
    try {
        const appointments = await appointmentModel.find({})
            .sort({ date: -1 })
            .limit(10);
        
        res.json({
            success: true,
            appointments
        });
        
    } catch (error) {
        console.error('❌ Recent appointments error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch recent appointments'
        });
    }
};

export {
    getDashboardStats,
    getWeeklyData,
    getMonthlyRevenue,
    getDoctorStats,
    getRecentAppointments
};
