import express from 'express';
import {
    createLaboratory,
    getAllLaboratories,
    addLabTest,
    getLabResults,
    createDoctor,
    updateDoctor
} from '../controllers/adminController.js';
import { authorizeRoles, requirePermission, auditLog } from '../middleware/roleAuth.js';
import authUser from '../middleware/authUser.js';
import multer from 'multer';

// Configure multer for file uploads
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'), false);
        }
    }
});

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authUser);
router.use(authorizeRoles('admin', 'super_admin'));

// Laboratory Management
router.post('/laboratories/create', auditLog('create_laboratory'), createLaboratory);
router.get('/laboratories', getAllLaboratories);
router.post('/laboratories/:labId/tests', auditLog('add_lab_test'), addLabTest);
router.get('/lab-results', getLabResults);

// Doctor Management (Enhanced)
router.post('/doctors/create', upload.single('image'), auditLog('create_doctor'), createDoctor);
router.put('/doctors/:doctorId', upload.single('image'), auditLog('update_doctor'), updateDoctor);

export default router;
