import superAdminModel from '../models/superAdminModel.js';
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

// Super Admin Login
const loginSuperAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        // Find super admin by email
        const superAdmin = await superAdminModel.findOne({ email });
        if (!superAdmin) {
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials",
                code: 'INVALID_CREDENTIALS'
            });
        }

        if (superAdmin.isLocked) {
            return res.status(423).json({ 
                success: false, 
                message: "Account locked. Try again later",
                code: 'ACCOUNT_LOCKED'
            });
        }

        const isMatch = await superAdmin.comparePassword(password);
        if (!isMatch) {
            await superAdmin.incLoginAttempts();
            return res.status(401).json({ 
                success: false, 
                message: "Invalid credentials",
                code: 'INVALID_CREDENTIALS'
            });
        }

        // Reset login attempts on successful login
        await superAdmin.updateOne({
            $unset: { loginAttempts: 1, lockUntil: 1 },
            $set: { lastLogin: new Date() }
        });

        const token = jwt.sign(
            { 
                id: superAdmin._id, 
                role: 'super_admin', 
                email: superAdmin.email,
                name: superAdmin.name
            }, 
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: "Super Admin login successful",
            data: {
                token,
                user: {
                    id: superAdmin._id,
                    name: superAdmin.name,
                    email: superAdmin.email,
                    role: superAdmin.role,
                    department: superAdmin.department,
                    permissions: superAdmin.permissions
                }
            }
        });

    } catch (error) {
        console.error("Super Admin login error:", error);
        res.status(500).json({ 
            success: false, 
            message: "Login failed",
            error: error.message
        });
    }
};

// Get Super Admin Profile
const getSuperAdminProfile = async (req, res) => {
    try {
        const superAdmin = await superAdminModel.findById(req.user.id).select('-password');
        if (!superAdmin) {
            return res.status(404).json({
                success: false,
                message: "Super Admin not found"
            });
        }

        res.json({
            success: true,
            data: superAdmin
        });

    } catch (error) {
        console.error("Get Super Admin profile error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch profile",
            error: error.message
        });
    }
};

export {
    loginSuperAdmin,
    getSuperAdminProfile
};
