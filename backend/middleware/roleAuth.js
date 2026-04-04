import jwt from 'jsonwebtoken';

// Role-based access control middleware
export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
        code: 'AUTH_REQUIRED'
      });
    }

    const userRole = req.user.role || 'patient';
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: allowedRoles,
        current: userRole
      });
    }

    // Add permissions to request for further checks
    req.permissions = getRolePermissions(userRole);
    next();
  };
};

// Get permissions based on role
const getRolePermissions = (role) => {
  const permissions = {
    super_admin: [
      'manage_users', 'manage_doctors', 'manage_admins', 'manage_settings',
      'view_all_appointments', 'delete_appointments', 'manage_lab',
      'view_reports', 'export_data', 'audit_logs', 'system_config'
    ],
    admin: [
      'manage_doctors', 'view_appointments', 'manage_lab', 'view_reports',
      'manage_schedules', 'doctor_performance', 'lab_operations'
    ],
    doctor: [
      'view_own_appointments', 'manage_own_schedule', 'view_patient_records',
      'prescribe_medicine', 'update_appointment_status', 'view_reports'
    ],
    patient: [
      'book_appointments', 'view_own_appointments', 'view_own_records',
      'update_profile', 'make_payments', 'view_prescriptions'
    ]
  };

  return permissions[role] || [];
};

// Permission-based middleware
export const requirePermission = (permission) => {
  return (req, res, next) => {
    if (!req.permissions || !req.permissions.includes(permission)) {
      return res.status(403).json({
        success: false,
        message: `Permission '${permission}' required`,
        code: 'PERMISSION_DENIED'
      });
    }
    next();
  };
};

// Audit logging middleware
export const auditLog = (action) => {
  return (req, res, next) => {
    const auditData = {
      user: req.user?.id,
      role: req.user?.role,
      action,
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      timestamp: new Date(),
      userAgent: req.get('User-Agent')
    };

    // Store audit log (implement in database)
    console.log('AUDIT LOG:', auditData);
    
    // Add audit data to request for potential use
    req.auditData = auditData;
    next();
  };
};
