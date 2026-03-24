import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import doctorModel from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import validator from "validator";
import { v2 as cloudinary } from "cloudinary";
import userModel from "../models/userModel.js";
import { generateToken, setAuthCookie } from "../utils/authUtils.js";

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body

        // Default admin credentials for MMC Mardan Medical Complex
        const defaultEmail = process.env.ADMIN_EMAIL || 'admin@mmc.com';
        const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';

        if (email === defaultEmail && password === defaultPassword) {
            // Generate JWT token with 1 hour expiry
            const payload = { email, role: 'admin' };
            const token = generateToken(payload);
            
            // Set HTTP-only cookie
            setAuthCookie(res, token);
            
            // Store minimal session data
            req.session = { user: { email, role: 'admin' } };
            
            res.json({ 
                success: true, 
                message: 'Login successful',
                user: { email, role: 'admin' }
            })
        } else {
            res.json({ success: false, message: "Invalid credentials" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get all appointments list
const appointmentsAdmin = async (req, res) => {
    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {

        const { appointmentId } = req.body
        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for adding Doctor
const addDoctor = async (req, res) => {

    try {

        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body
        const imageFile = req.file

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
            return res.json({ success: false, message: "Missing Details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address),
            date: Date.now()
        }

        const newDoctor = new doctorModel(doctorData)
        await newDoctor.save()
        res.json({ success: true, message: 'Doctor Added' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select('-password')
        res.json({ success: true, doctors })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        // Calculate earnings
        const completedAppointments = appointments.filter(apt => !apt.cancelled);
        const totalEarnings = completedAppointments.reduce((sum, apt) => sum + apt.amount, 0);
        
        // Get monthly earnings data
        const today = new Date();
        const thisMonthEarnings = completedAppointments
            .filter(apt => new Date(apt.date).getMonth() === today.getMonth())
            .reduce((sum, apt) => sum + apt.amount, 0);

        // Get recent activity
        const recentAppointments = await appointmentModel.find({})
            .populate('userId', 'name')
            .populate('docId', 'name')
            .sort({ date: -1 })
            .limit(10);

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            totalEarnings,
            thisMonthEarnings,
            latestAppointments: recentAppointments,
            stats: {
                completedAppointments: completedAppointments.length,
                cancelledAppointments: appointments.filter(apt => apt.cancelled).length,
                activeDoctors: doctors.filter(doc => doc.available).length,
                newPatientsThisMonth: users.filter(user => {
                    const userDate = new Date(user.date);
                    return userDate.getMonth() === today.getMonth() && userDate.getFullYear() === today.getFullYear();
                }).length
            }
        }

        res.json({ success: true, dashData })
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get analytics data
const getAnalytics = async (req, res) => {
    try {
        const { period = 'month' } = req.query;
        
        const appointments = await appointmentModel.find({});
        const doctors = await doctorModel.find({});
        const users = await userModel.find({});

        let analyticsData = {};

        if (period === 'month') {
            // Last 6 months data
            const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
            const today = new Date();
            
            analyticsData.appointmentsByMonth = [];
            analyticsData.earningsByMonth = [];
            analyticsData.newUsersByMonth = [];
            
            for (let i = 5; i >= 0; i--) {
                const monthDate = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const monthStart = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
                const monthEnd = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
                
                const monthAppointments = appointments.filter(apt => {
                    const aptDate = new Date(apt.date);
                    return aptDate >= monthStart && aptDate <= monthEnd;
                });
                
                const monthEarnings = monthAppointments
                    .filter(apt => !apt.cancelled)
                    .reduce((sum, apt) => sum + apt.amount, 0);
                
                const monthUsers = users.filter(user => {
                    const userDate = new Date(user.date);
                    return userDate >= monthStart && userDate <= monthEnd;
                });

                analyticsData.appointmentsByMonth.push({
                    month: months[monthDate.getMonth()],
                    total: monthAppointments.length,
                    completed: monthAppointments.filter(apt => !apt.cancelled).length,
                    cancelled: monthAppointments.filter(apt => apt.cancelled).length
                });
                
                analyticsData.earningsByMonth.push({
                    month: months[monthDate.getMonth()],
                    earnings: monthEarnings
                });
                
                analyticsData.newUsersByMonth.push({
                    month: months[monthDate.getMonth()],
                    users: monthUsers.length
                });
            }
        }

        // Speciality breakdown
        const specialityStats = {};
        doctors.forEach(doctor => {
            if (!specialityStats[doctor.speciality]) {
                specialityStats[doctor.speciality] = {
                    count: 0,
                    earnings: 0,
                    appointments: 0
                };
            }
            specialityStats[doctor.speciality].count++;
            
            const doctorAppointments = appointments.filter(apt => 
                apt.docId.toString() === doctor._id.toString() && !apt.cancelled
            );
            specialityStats[doctor.speciality].appointments += doctorAppointments.length;
            specialityStats[doctor.speciality].earnings += doctorAppointments
                .reduce((sum, apt) => sum + apt.amount, 0);
        });

        analyticsData.specialityBreakdown = Object.entries(specialityStats).map(([speciality, stats]) => ({
            speciality,
            ...stats
        }));

        res.json({ success: true, analytics: analyticsData });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to manage users
const manageUsers = async (req, res) => {
    try {
        const { action, userId, page = 1, limit = 10, search } = req.query;
        
        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } }
                ]
            };
        }

        if (action === 'delete' && userId) {
            await userModel.findByIdAndDelete(userId);
            return res.json({ success: true, message: 'User deleted successfully' });
        }

        const users = await userModel.find(query)
            .select('-password')
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await userModel.countDocuments(query);

        res.json({
            success: true,
            users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to manage doctors
const manageDoctors = async (req, res) => {
    try {
        const { action, doctorId, page = 1, limit = 10, search } = req.query;
        
        let query = {};
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                    { speciality: { $regex: search, $options: 'i' } }
                ]
            };
        }

        if (action === 'delete' && doctorId) {
            await doctorModel.findByIdAndDelete(doctorId);
            return res.json({ success: true, message: 'Doctor deleted successfully' });
        }

        if (action === 'toggle-availability' && doctorId) {
            const doctor = await doctorModel.findById(doctorId);
            await doctorModel.findByIdAndUpdate(doctorId, { available: !doctor.available });
            return res.json({ success: true, message: 'Doctor availability updated' });
        }

        const doctors = await doctorModel.find(query)
            .select('-password')
            .sort({ date: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await doctorModel.countDocuments(query);

        res.json({
            success: true,
            doctors,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to get system settings
const getSystemSettings = async (req, res) => {
    try {
        // This could be expanded to include actual system settings
        const settings = {
            platform: {
                name: 'MMC Mardan Medical Complex',
                version: '1.0.0',
                maintenance: false
            },
            appointments: {
                autoConfirm: false,
                allowCancellation: true,
                cancellationDeadline: 24 // hours
            },
            payments: {
                stripeEnabled: true,
                easyPaisaEnabled: true,
                jazzCashEnabled: true
            },
            notifications: {
                emailNotifications: true,
                smsNotifications: false,
                appointmentReminders: true
            }
        };

        res.json({ success: true, settings });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

// API to update system settings
const updateSystemSettings = async (req, res) => {
    try {
        const { settings } = req.body;
        
        // This would typically save to a database
        // For now, just return success
        res.json({ success: true, message: 'Settings updated successfully', settings });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export {
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
}