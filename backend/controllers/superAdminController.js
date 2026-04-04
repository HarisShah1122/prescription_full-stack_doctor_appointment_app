import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import superAdminModel from "../models/superAdminModel.js";
import adminModel from "../models/adminModel.js";
import doctorModel from "../models/doctorModel.js";
import { laboratoryModel } from "../models/laboratoryModel.js";
import { auditLog } from "../middleware/roleAuth.js";

// Super Admin Login
const loginSuperAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        
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
            { id: superAdmin._id, role: 'super_admin', email: superAdmin.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: {
                    id: superAdmin._id,
                    name: superAdmin.name,
                    email: superAdmin.email,
                    role: superAdmin.role,
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

// Create Admin
const createAdmin = async (req, res) => {
    try {
        const { name, email, password, department, specialization, permissions } = req.body;

        // Check if admin already exists
        const existingAdmin = await adminModel.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({
                success: false,
                message: "Admin with this email already exists",
                code: 'ADMIN_EXISTS'
            });
        }

        const admin = new adminModel({
            name,
            email,
            password,
            department,
            specialization,
            permissions: permissions || [
                { module: 'doctors', actions: ['create', 'read', 'update', 'delete'] },
                { module: 'appointments', actions: ['read', 'update'] },
                { module: 'laboratory', actions: ['create', 'read', 'update'] }
            ],
            createdBy: req.user.id
        });

        await admin.save();

        res.status(201).json({
            success: true,
            message: "Admin created successfully",
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                department: admin.department,
                role: admin.role
            }
        });

    } catch (error) {
        console.error("Create admin error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create admin",
            error: error.message
        });
    }
};

// Get All Users by Role
const getAllUsersByRole = async (req, res) => {
    try {
        const { role } = req.params;
        
        let users = [];
        switch (role) {
            case 'admins':
                users = await adminModel.find({ isActive: true })
                    .select('-password')
                    .populate('createdBy', 'name email');
                break;
            case 'doctors':
                users = await doctorModel.find({ isActive: true })
                    .select('-password');
                break;
            case 'patients':
                // Assuming you have a user model for patients
                users = await userModel.find({ isActive: true })
                    .select('-password');
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid role specified",
                    code: 'INVALID_ROLE'
                });
        }

        res.json({
            success: true,
            data: users,
            count: users.length
        });

    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch users",
            error: error.message
        });
    }
};

// System Statistics
const getSystemStats = async (req, res) => {
    try {
        const [
            totalAdmins,
            totalDoctors,
            totalPatients,
            totalLabs,
            totalAppointments,
            totalLabTests
        ] = await Promise.all([
            adminModel.countDocuments({ isActive: true }),
            doctorModel.countDocuments({ isActive: true }),
            userModel.countDocuments({ isActive: true }),
            laboratoryModel.countDocuments({ isActive: true }),
            appointmentModel.countDocuments(),
            labResultModel.countDocuments()
        ]);

        res.json({
            success: true,
            data: {
                users: {
                    admins: totalAdmins,
                    doctors: totalDoctors,
                    patients: totalPatients
                },
                facilities: {
                    laboratories: totalLabs
                },
                operations: {
                    appointments: totalAppointments,
                    labTests: totalLabTests
                }
            }
        });

    } catch (error) {
        console.error("System stats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch system statistics",
            error: error.message
        });
    }
};

// Update User Status (Activate/Deactivate)
const updateUserStatus = async (req, res) => {
    try {
        const { userId, status } = req.body;
        const { role } = req.params;

        let user;
        switch (role) {
            case 'admin':
                user = await adminModel.findByIdAndUpdate(userId, { isActive: status });
                break;
            case 'doctor':
                user = await doctorModel.findByIdAndUpdate(userId, { isActive: status });
                break;
            case 'patient':
                user = await userModel.findByIdAndUpdate(userId, { isActive: status });
                break;
            default:
                return res.status(400).json({
                    success: false,
                    message: "Invalid role specified",
                    code: 'INVALID_ROLE'
                });
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                code: 'USER_NOT_FOUND'
            });
        }

        res.json({
            success: true,
            message: `User ${status ? 'activated' : 'deactivated'} successfully`
        });

    } catch (error) {
        console.error("Update user status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update user status",
            error: error.message
        });
    }
};

// Audit Logs
const getAuditLogs = async (req, res) => {
    try {
        const { page = 1, limit = 50, role, userId, action } = req.query;
        
        // This would typically query your audit logs collection
        // For now, returning a placeholder response
        res.json({
            success: true,
            message: "Audit logs feature - implement with MongoDB collection",
            data: [],
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total: 0
            }
        });

    } catch (error) {
        console.error("Audit logs error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch audit logs",
            error: error.message
        });
    }
};

export {
    loginSuperAdmin,
    createAdmin,
    getAllUsersByRole,
    getSystemStats,
    updateUserStatus,
    getAuditLogs
};
