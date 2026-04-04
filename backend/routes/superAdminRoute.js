import express from 'express';
import {
    loginSuperAdmin,
    createAdmin,
    getAllUsersByRole,
    getSystemStats,
    updateUserStatus,
    getAuditLogs
} from '../controllers/superAdminController.js';
import { loginSuperAdmin as loginSuperAdminAuth, getSuperAdminProfile } from '../controllers/superAdminAuthController.js';
import { authorizeRoles, requirePermission, auditLog } from '../middleware/roleAuth.js';
import authUser from '../middleware/authUser.js';

const router = express.Router();

// Super Admin Authentication
router.post('/login', loginSuperAdminAuth);

// All super admin routes require authentication and super admin role
router.use(authUser);
router.use(authorizeRoles('super_admin'));

// Admin Management
router.post('/admins/create', auditLog('create_admin'), createAdmin);
router.get('/users/:role', getAllUsersByRole);
router.put('/users/:role/:userId/status', auditLog('update_user_status'), updateUserStatus);

// System Management
router.get('/stats', getSystemStats);
router.get('/audit-logs', auditLog('view_audit_logs'), getAuditLogs);

// Profile
router.get('/profile', getSuperAdminProfile);

export default router;
