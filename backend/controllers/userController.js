import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from "cloudinary";
import stripe from "stripe";

// Stripe Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);

// ------------------- Payment Handlers -------------------

// EasyPaisa payment
const paymentEasyPaisa = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment Cancelled or not found" });
        }

        // Replace with real EasyPaisa integration
        res.json({
            success: true,
            payment_url: `https://easypaisa.example.com/pay?appointmentId=${appointmentId}`
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// JazzCash payment
const paymentJazzCash = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment Cancelled or not found" });
        }

        // Replace with real JazzCash integration
        res.json({
            success: true,
            payment_url: `https://jazzcash.example.com/pay?appointmentId=${appointmentData._id}&amount=${appointmentData.amount}`
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Stripe payment
const paymentStripe = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const { origin } = req.headers;

        const appointmentData = await appointmentModel.findById(appointmentId);
        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment Cancelled or not found" });
        }

        const currency = process.env.CURRENCY.toLowerCase();
        const line_items = [{
            price_data: {
                currency,
                product_data: { name: "Appointment Fees" },
                unit_amount: appointmentData.amount * 100
            },
            quantity: 1
        }];

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            line_items,
            mode: "payment"
        });

        res.json({ success: true, session_url: session.url });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Verify Stripe payment
const verifyStripe = async (req, res) => {
    try {
        const { appointmentId, success } = req.body;

        if (success === "true") {
            await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true });
            return res.json({ success: true, message: "Payment Successful" });
        }

        res.json({ success: false, message: "Payment Failed" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// ------------------- Authentication -------------------

// Logout user - Clear tokens and session
const logoutUser = async (req, res) => {
    try {
        console.log('🔐 Logout request received');
        console.log('👤 User ID:', req.user?.id);
        console.log('🌐 IP:', req.ip);

        // Clear HTTP-only cookie
        res.clearCookie('token', {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            path: '/'
        });
        console.log('🍪 Cookie cleared');

        // Clear session data
        if (req.session) {
            req.session.token = null;
            req.session.user = null;
            req.session.destroy((err) => {
                if (err) {
                    console.error('❌ Session destroy error:', err);
                } else {
                    console.log('🔐 Session destroyed');
                }
            });
        }

        // Update last logout time in database
        if (req.user?.id) {
            await userModel.findByIdAndUpdate(req.user?.id, {
                lastLogout: new Date(),
                lastLogoutIP: req.ip
            });
        }

        console.log('✅ Logout successful');
        
        res.status(200).json({
            success: true,
            message: 'Logout successful',
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Logout error:', error);
        res.status(500).json({
            success: false,
            message: 'Logout failed',
            code: 'LOGOUT_ERROR',
            timestamp: new Date().toISOString()
        });
    }
};

// ------------------- User Authentication -------------------

// Register user - Enhanced with session management and proper response
const registerUser = async (req, res) => {
    try {
        console.log('📝 Registration attempt received');
        console.log('📧 Email:', req.body.email);
        console.log('👤 Name:', req.body.name);
        
        const { name, email, password } = req.body;
        
        // Input validation
        if (!name || !email || !password) {
            console.log('❌ Missing registration details');
            return res.status(400).json({ 
                success: false, 
                message: "Missing Details",
                code: 'MISSING_DETAILS'
            });
        }
        
        if (!validator.isEmail(email)) {
            console.log('❌ Invalid email format');
            return res.status(400).json({ 
                success: false, 
                message: "Invalid email",
                code: 'INVALID_EMAIL'
            });
        }
        
        if (password.length < 8) {
            console.log('❌ Password too weak');
            return res.status(400).json({ 
                success: false, 
                message: "Password too weak",
                code: 'PASSWORD_TOO_WEAK'
            });
        }

        // Check if user already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            console.log('❌ User already exists:', email);
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
                code: 'USER_EXISTS'
            });
        }

        // Hash password
        console.log('🔐 Hashing password...');
        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
        
        // Create user
        console.log('👤 Creating new user...');
        const user = await new userModel({ 
            name, 
            email, 
            password: hashedPassword,
            active: true,
            createdAt: new Date()
        }).save();

        // Generate JWT token for auto-login
        console.log('🎫 Generating token for new user...');
        const tokenPayload = {
            id: user._id,
            email: user.email,
            role: user.role || 'user',
            loginTime: Date.now()
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: '1h',
            algorithm: 'HS256',
            issuer: 'prescription-app',
            audience: 'prescription-users'
        });

        // Set session data
        if (req.session) {
            req.session.user = {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role || 'user'
            };
            req.session.token = token;
            req.session.loginTime = Date.now();
            req.session.ip = req.ip;
            console.log('🔐 Session data set for new user');
        }

        // Set HTTP-only cookie with exact required format
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 60 * 60 * 1000, // 1 hour
            path: '/'
        });
        console.log('🍪 Cookie set with token:', token.substring(0, 20) + '...');

        // Prepare user data for response
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role || 'user',
            profileImage: user.image || null,
            createdAt: user.createdAt
        };

        console.log('✅ Registration successful for:', email);
        console.log('🎫 Token generated, session created');

        // Success response (consistent with login format)
        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: {
                user: userData,
                token: token, // Include token for backward compatibility
                expiresIn: '1h',
                tokenType: 'Bearer'
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Registration error:', error);
        console.error('🔍 Error stack:', error.stack);
        
        // Handle duplicate key error
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: "User already exists with this email",
                code: 'USER_EXISTS'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Registration failed. Please try again.',
            code: 'REGISTRATION_ERROR',
            timestamp: new Date().toISOString()
        });
    }
};

// Enhanced secure login with JWT, session management, and comprehensive validation
const loginUser = async (req, res) => {
    try {
        console.log('🔐 Login attempt received');
        console.log('📧 Email:', req.body.email);
        console.log('🌐 IP:', req.ip);
        console.log('🔍 User-Agent:', req.get('User-Agent'));

        // Input validation
        const { email, password } = req.body;
        
        if (!email || !password) {
            console.log('❌ Missing credentials');
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
                code: 'MISSING_CREDENTIALS'
            });
        }

        // Email format validation
        if (!validator.isEmail(email)) {
            console.log('❌ Invalid email format');
            return res.status(400).json({
                success: false,
                message: 'Invalid email format',
                code: 'INVALID_EMAIL'
            });
        }

        // Find user with password
        console.log('🔍 Looking up user...');
        const user = await userModel.findOne({ email }).select('+password');
        
        if (!user) {
            console.log('❌ User not found:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
                code: 'INVALID_CREDENTIALS'
            });
        }

        // Check account status
        if (user.active === false) {
            console.log('❌ Account deactivated:', email);
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact support.',
                code: 'ACCOUNT_DEACTIVATED'
            });
        }

        // Verify password
        console.log('🔑 Verifying password...');
        const isMatch = await bcrypt.compare(password, user.password);
        
        if (!isMatch) {
            console.log('❌ Password mismatch for:', email);
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
                code: 'INVALID_CREDENTIALS'
            });
        }

        // Generate JWT token
        console.log('✅ Password verified, generating token...');
        const tokenPayload = {
            id: user._id,
            email: user.email,
            role: user.role || 'user',
            loginTime: Date.now()
        };

        const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
            expiresIn: '1h',
            algorithm: 'HS256',
            issuer: 'prescription-app',
            audience: 'prescription-users'
        });

        // Update last login
        await userModel.findByIdAndUpdate(user._id, {
            lastLogin: new Date(),
            lastLoginIP: req.ip,
            lastLoginUserAgent: req.get('User-Agent')
        });

        // Set session data
        if (req.session) {
            req.session.user = {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role || 'user'
            };
            req.session.token = token;
            req.session.loginTime = Date.now();
            req.session.ip = req.ip;
            console.log('🔐 Session data set');
        }

        // Set HTTP-only cookie with exact required format
        res.cookie('token', token, {
            httpOnly: true,
            sameSite: "lax",
            secure: false,
            maxAge: 60 * 60 * 1000, // 1 hour
            path: '/'
        });
        console.log('🍪 Cookie set with token:', token.substring(0, 20) + '...');

        // Prepare user data for response
        const userData = {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role || 'user',
            profileImage: user.image || null,
            createdAt: user.createdAt
        };

        console.log('✅ Login successful for:', email);
        console.log('🎫 Token generated, session created');

        // Success response
        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userData,
                token: token, // Include token for backward compatibility
                expiresIn: '1h',
                tokenType: 'Bearer'
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Login error:', error);
        console.error('🔍 Error stack:', error.stack);
        
        res.status(500).json({
            success: false,
            message: 'Internal server error during login',
            code: 'LOGIN_ERROR',
            timestamp: new Date().toISOString()
        });
    }
};

// Get user profile - Enhanced to work with multiple auth sources
const getProfile = async (req, res) => {
    try {
        console.log('👤 Profile request received');
        console.log('🔍 User ID from auth middleware:', req.user?.id);
        console.log('🔍 User data from auth middleware:', req.user);
        
        // Get userId from enhanced auth middleware
        const userId = req.user?.id;
        
        if (!userId) {
            console.log('❌ No user ID found in request');
            return res.status(401).json({
                success: false,
                message: 'User authentication required',
                code: 'USER_ID_MISSING'
            });
        }
        
        console.log('🔍 Fetching user profile for ID:', userId);
        const userData = await userModel.findById(userId).select("-password");
        
        if (!userData) {
            console.log('❌ User not found in database');
            return res.status(404).json({
                success: false,
                message: 'User not found',
                code: 'USER_NOT_FOUND'
            });
        }
        
        console.log('✅ User profile found:', userData.email);
        
        // Return user data in expected format
        res.status(200).json({
            success: true,
            userData: {
                id: userData._id,
                name: userData.name,
                email: userData.email,
                role: userData.role || 'user',
                profileImage: userData.image || null,
                createdAt: userData.createdAt,
                lastLogin: userData.lastLogin,
                active: userData.active !== false
            }
        });
    } catch (error) {
        console.error('❌ Profile fetch error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user profile',
            code: 'PROFILE_FETCH_ERROR'
        });
    }
};

// Update user profile
const updateProfile = async (req, res) => {
    try {
        const { userId, name, phone, address, dob, gender } = req.body;
        if (!name || !phone || !dob || !gender) return res.json({ success: false, message: "Data Missing" });

        const updateData = { name, phone, address: address ? JSON.parse(address) : {}, dob, gender };
        await userModel.findByIdAndUpdate(userId, updateData);

        if (req.file) {
            const imageUpload = await cloudinary.uploader.upload(req.file.path, { resource_type: "image" });
            await userModel.findByIdAndUpdate(userId, { image: imageUpload.secure_url });
        }

        res.json({ success: true, message: "Profile Updated" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// ------------------- Appointments -------------------

// Book appointment
const bookAppointment = async (req, res) => {
    try {
        console.log('📅 BOOKING APPOINTMENT - START');
        console.log('📅 Request body:', req.body);
        console.log('📅 req.user:', req.user);
        console.log('📅 req.userId:', req.userId);
        
        const { docId, slotDate, slotTime } = req.body;
        
        // Get user ID from multiple sources for safety
        let userId = req.user?.id || req.userId;
        
        console.log('📅 Final userId:', userId);
        console.log('📅 userId type:', typeof userId);
        console.log('📅 userId is valid ObjectId:', mongoose.Types.ObjectId.isValid(userId));
        
        if (!userId) {
            console.log('❌ User ID not found in request');
            return res.status(401).json({
                success: false,
                message: 'User authentication required',
                code: 'USER_ID_MISSING'
            });
        }
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            console.log('❌ Invalid ObjectId format:', userId);
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format',
                code: 'INVALID_USER_ID'
            });
        }
        
        // Fetch user with proper error handling
        console.log('🔍 Fetching user from database...');
        console.log('🔍 Using userModel.findById with ID:', userId);
        console.log('🔍 userModel:', !!userModel);
        
        const userRecord = await userModel.findById(userId).select("-password");
        
        console.log('🔍 userRecord result:', !!userRecord);
        console.log('🔍 userRecord type:', typeof userRecord);
        
        if (!userRecord) {
            console.log('❌ User not found in database with ID:', userId);
            console.log('❌ Stack trace:', new Error().stack);
            
            // Let's also check if there are any users in the database
            const allUsers = await userModel.find({}).select('_id email name').limit(5);
            console.log('🔍 Sample users in database:', allUsers.map(u => ({ id: u._id, email: u.email, name: u.name })));
            
            return res.status(404).json({
                success: false,
                message: 'User not found',
                code: 'USER_NOT_FOUND',
                debug: {
                    userId: userId,
                    userIdType: typeof userId,
                    validObjectId: mongoose.Types.ObjectId.isValid(userId),
                    totalUsers: await userModel.countDocuments()
                }
            });
        }
        
        console.log('✅ User found in database:', userRecord.email);
        
        // Handle both ObjectId and string IDs from frontend assets
        let docData;
        if (docId.startsWith('doc')) {
            // Map frontend asset IDs to doctor names
            const doctorNameMap = {
                'doc1': 'Dr. Ahmed Khan',
                'doc2': 'Dr. Fatima Zahra', 
                'doc3': 'Dr. Ayesha Siddiqui',
                'doc4': 'Dr. Muhammad Ali',
                'doc5': 'Dr. Sara Hassan',
                'doc6': 'Dr. Omar Farooq',
                'doc7': 'Dr. Hira Tariq',
                'doc8': 'Dr. Ali Raza',
                'doc9': 'Dr. Mariam Yousuf',
                'doc10': 'Dr. Hamza Malik',
                'doc11': 'Dr. Bilal Ahmed',
                'doc12': 'Dr. Sana Khan'
            };
            
            const doctorName = doctorNameMap[docId];
            if (doctorName) {
                docData = await doctorModel.findOne({ name: doctorName }).select("-password");
            }
        } else {
            // Handle ObjectId format
            docData = await doctorModel.findById(docId).select("-password");
        }

        if (!docData) {
            return res.status(404).json({
                success: false,
                message: "Doctor Not Found",
                code: 'DOCTOR_NOT_FOUND'
            });
        }

        const slots = docData.slots_booked || {};
        if (!slots[slotDate]) slots[slotDate] = [];
        if (slots[slotDate].includes(slotTime)) {
            return res.status(409).json({
                success: false,
                message: "Slot Not Available",
                code: 'SLOT_NOT_AVAILABLE'
            });
        }
        slots[slotDate].push(slotTime);

        const appointmentData = { 
            userId, 
            docId, 
            userData: userRecord.toObject(), 
            docData: docData.toObject(), 
            amount: docData.fees, 
            slotTime, 
            slotDate, 
            date: Date.now() 
        };
        await new appointmentModel(appointmentData).save();

        // Update doctor slots using proper ID
        const updateId = docId.startsWith('doc') ? docData._id : docId;
        await doctorModel.findByIdAndUpdate(updateId, { slots_booked: slots });
        res.json({ success: true, message: "Appointment Booked" });
    } catch (error) {
        console.error('❌ Book appointment error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to book appointment',
            code: 'BOOKING_ERROR'
        });
    }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const userId = req.user?.id || req.userId; // Get from auth middleware
        
        console.log('❌ Cancel appointment - User ID:', userId);
        console.log('❌ Cancel appointment - Appointment ID:', appointmentId);
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required',
                code: 'USER_ID_MISSING'
            });
        }
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format',
                code: 'INVALID_USER_ID'
            });
        }
        
        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: 'Appointment not found',
                code: 'APPOINTMENT_NOT_FOUND'
            });
        }

        if (appointment.userId.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: 'Unauthorized',
                code: 'UNAUTHORIZED'
            });
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true });
        
        // Handle both ObjectId and string IDs for doctor lookup
        let docData;
        if (appointment.docId.startsWith('doc')) {
            // Map frontend asset IDs to doctor names
            const doctorNameMap = {
                'doc1': 'Dr. Ahmed Khan',
                'doc2': 'Dr. Fatima Zahra', 
                'doc3': 'Dr. Ayesha Siddiqui',
                'doc4': 'Dr. Muhammad Ali',
                'doc5': 'Dr. Sara Hassan',
                'doc6': 'Dr. Omar Farooq',
                'doc7': 'Dr. Hira Tariq',
                'doc8': 'Dr. Ali Raza',
                'doc9': 'Dr. Mariam Yousuf',
                'doc10': 'Dr. Hamza Malik',
                'doc11': 'Dr. Bilal Ahmed',
                'doc12': 'Dr. Sana Khan'
            };
            
            const doctorName = doctorNameMap[appointment.docId];
            if (doctorName) {
                docData = await doctorModel.findOne({ name: doctorName });
            }
        } else {
            // Handle ObjectId format
            docData = await doctorModel.findById(appointment.docId);
        }
        
        if (!docData) {
            return res.status(404).json({
                success: false,
                message: "Doctor Not Found",
                code: 'DOCTOR_NOT_FOUND'
            });
        }
        
        const slots = docData.slots_booked || {};
        slots[appointment.slotDate] = (slots[appointment.slotDate] || []).filter(e => e !== appointment.slotTime);
        
        // Update doctor slots using proper ID
        const updateId = appointment.docId.startsWith('doc') ? docData._id : appointment.docId;
        await doctorModel.findByIdAndUpdate(updateId, { slots_booked: slots });

        res.json({ success: true, message: "Appointment Cancelled" });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// List appointments
const listAppointment = async (req, res) => {
    try {
        const userId = req.user?.id || req.userId; // Get from auth middleware
        
        console.log('📋 List appointments - User ID:', userId);
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required',
                code: 'USER_ID_MISSING'
            });
        }
        
        // Validate ObjectId format
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user ID format',
                code: 'INVALID_USER_ID'
            });
        }
        
        const appointments = await appointmentModel.find({ userId });
        res.json({ success: true, appointments });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};


// ------------------- Exports -------------------
export {
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
    logoutUser
};
