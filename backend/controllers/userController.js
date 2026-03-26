import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from "cloudinary";
import stripe from "stripe";
import { generateToken, setAuthCookie } from "../utils/authUtils.js";

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

// ------------------- User Authentication -------------------

// Register user
const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: "Missing Details" });
        }
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Invalid email" });
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Password too weak" });
        }

        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
        const user = await new userModel({ name, email, password: hashedPassword }).save();

        // Generate JWT token with 1 hour expiry
        const payload = { id: user._id, email: user.email, role: 'user' };
        const token = generateToken(payload);
        
        // Set HTTP-only cookie
        setAuthCookie(res, token);
        
        // Store minimal session data
        req.session = { user: { id: user._id, email: user.email, role: 'user' } };
        
        res.json({ 
            success: true, 
            token: token, // Include token for backward compatibility
            user: { 
                id: user._id, 
                email: user.email, 
                name: user.name,
                role: 'user' 
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Login user
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select('+password');
        if (!user) return res.json({ success: false, message: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

        // Generate JWT token with 1 hour expiry
        const payload = { id: user._id, email: user.email, role: 'user' };
        const token = generateToken(payload);
        
        // Set HTTP-only cookie
        setAuthCookie(res, token);
        
        // Store minimal session data
        req.session = { user: { id: user._id, email: user.email, role: 'user' } };
        
        res.json({ 
            success: true, 
            message: 'Login successful',
            token: token, // Include token for backward compatibility
            user: { 
                id: user._id, 
                email: user.email, 
                name: user.name,
                role: 'user' 
            }
        });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Get user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.userId; // Get from auth middleware
        const userData = await userModel.findById(userId).select("-password");
        res.json({ success: true, userData });
    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
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
        const { docId, slotDate, slotTime } = req.body;
        const userId = req.userId; // Get from auth middleware
        
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

        if (!docData) return res.json({ success: false, message: "Doctor Not Found" });

        const slots = docData.slots_booked || {};
        if (!slots[slotDate]) slots[slotDate] = [];
        if (slots[slotDate].includes(slotTime)) return res.json({ success: false, message: "Slot Not Available" });
        slots[slotDate].push(slotTime);

        const userData = await userModel.findById(userId).select("-password");
        if (!userData) return res.json({ success: false, message: "User not found" });
        
        const appointmentData = { 
            userId, 
            docId, 
            userData: userData.toObject(), 
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
        console.error(error);
        res.json({ success: false, message: error.message });
    }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const userId = req.userId; // Get from auth middleware
        const appointment = await appointmentModel.findById(appointmentId);

        if (appointment.userId !== userId) return res.json({ success: false, message: "Unauthorized" });

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
        
        if (!docData) return res.json({ success: false, message: "Doctor Not Found" });
        
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
        const userId = req.userId; // Get from auth middleware
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
    verifyStripe
};
