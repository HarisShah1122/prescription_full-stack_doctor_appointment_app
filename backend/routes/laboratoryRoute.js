import express from 'express';
import multer from 'multer';
import {
    createLabTest,
    updateLabTest,
    getLabTests,
    generateLabReport,
    getLabReports,
    uploadReportPDF,
    createLabBilling,
    getLabBillings,
    updatePaymentStatus,
    getPermissionMatrix,
    updatePermissionMatrix
} from '../controllers/laboratoryController.js';
import {
    getLabTests as getLabTestsFixed,
    getLabReports as getLabReportsFixed,
    getLabBillings as getLabBillingsFixed,
    getLabStats as getLabStatsFixed
} from '../controllers/laboratoryControllerFixed.js';
import { authorizeRoles, requirePermission } from '../middleware/roleAuth.js';
import authUser from '../middleware/authUser.js';

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only PDF and image files are allowed'), false);
        }
    }
});

// All routes require authentication
router.use(authUser);

// ==================== TEST MANAGEMENT ====================

// Create lab test - Admin or Lab Technician
router.post('/tests', 
    authorizeRoles('admin', 'super_admin', 'lab_technician'),
    requirePermission('manage_lab'),
    createLabTest
);

// Update lab test - Admin or Lab Technician
router.put('/tests/:labId/:testId',
    authorizeRoles('admin', 'super_admin', 'lab_technician'),
    requirePermission('manage_lab'),
    updateLabTest
);

// Get all lab tests - All authenticated users
router.get('/tests',
    authUser,
    getLabTestsFixed
);

// ==================== REPORT MANAGEMENT ====================

// Generate lab report - Lab Technician or Doctor
router.post('/reports',
    authorizeRoles('admin', 'super_admin', 'doctor', 'lab_technician'),
    requirePermission('manage_lab'),
    generateLabReport
);

// Get lab reports - Based on role
router.get('/reports',
    authUser,
    getLabReportsFixed
);

// Upload report PDF - Lab Technician or Admin
router.post('/reports/:reportId/upload',
    authorizeRoles('admin', 'super_admin', 'lab_technician'),
    requirePermission('manage_lab'),
    upload.single('report'),
    uploadReportPDF
);

// ==================== BILLING MANAGEMENT ====================

// Create lab billing - Admin
router.post('/billing',
    authorizeRoles('admin', 'super_admin'),
    requirePermission('manage_billing'),
    createLabBilling
);

// Get lab billings - Based on role
router.get('/billing',
    authUser,
    getLabBillingsFixed
);

// Update payment status - Admin
router.put('/billing/:billingId/payment',
    authorizeRoles('admin', 'super_admin'),
    requirePermission('manage_billing'),
    updatePaymentStatus
);

// ==================== PERMISSION MATRIX ====================

// Get permission matrix - Super Admin or Admin
router.get('/permissions/:role',
    authorizeRoles('super_admin', 'admin'),
    getPermissionMatrix
);

// Update permission matrix - Super Admin only
router.put('/permissions/:role',
    authorizeRoles('super_admin'),
    requirePermission('manage_permissions'),
    updatePermissionMatrix
);

// ==================== LABORATORY OPERATIONS ====================

// Get laboratory statistics - All authenticated users
router.get('/stats',
    authUser,
    getLabStatsFixed
);

// Get laboratory performance metrics - Admin
router.get('/performance',
    authorizeRoles('admin', 'super_admin'),
    async (req, res) => {
        try {
            const { laboratoryModel, labResultModel, reportModel } = await import('../models/laboratoryModel.js');
            
            const dateFrom = req.query.dateFrom;
            const dateTo = req.query.dateTo;
            
            let dateFilter = {};
            if (dateFrom || dateTo) {
                dateFilter = {};
                if (dateFrom) dateFilter.$gte = new Date(dateFrom);
                if (dateTo) dateFilter.$lte = new Date(dateTo);
            }

            const [
                labPerformance,
                testCategories,
                reportStats
            ] = await Promise.all([
                // Lab performance
                laboratoryModel.aggregate([
                    { $match: { isActive: true } },
                    { $lookup: { from: 'labresults', localField: '_id', foreignField: 'labId', as: 'results' } },
                    { $project: {
                        name: 1,
                        labCode: 1,
                        totalResults: { $size: '$results' },
                        completedResults: { 
  $size: { 
    $filter: { 
      input: '$results', 
      cond: { $eq: ['$$this.status', 'Completed'] } 
    } 
  }
}
                    }}
                ]),
                // Test categories distribution
                laboratoryModel.aggregate([
                    { $unwind: '$services' },
                    { $match: { 'services.isActive': true } },
                    { $group: { _id: '$services.category', count: { $sum: 1 } } },
                    { $sort: { count: -1 } }
                ]),
                // Report statistics
                reportModel.aggregate([
                    ...(dateFilter ? [{ $match: { reportDate: dateFilter } }] : []),
                    { $group: {
                        _id: '$overallStatus',
                        count: { $sum: 1 }
                    }}
                ])
            ]);

            res.json({
                success: true,
                data: {
                    labPerformance,
                    testCategories,
                    reportStats
                }
            });

        } catch (error) {
            console.error("Lab performance error:", error);
            res.status(500).json({
                success: false,
                message: "Failed to fetch laboratory performance",
                error: error.message
            });
        }
    }
);

export default router;
