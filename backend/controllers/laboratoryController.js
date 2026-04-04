import { laboratoryModel, labTestModel, labResultModel, labTechnicianModel } from "../models/laboratoryModel.js";
import reportModel from "../models/reportModel.js";
import billingModel from "../models/billingModel.js";
import { permissionMatrixModel } from "../models/permissionModel.js";
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

// Test Management Controllers

// Create new lab test
const createLabTest = async (req, res) => {
    try {
        const { labId, testName, testCode, category, description, price, duration, requirements, preparation } = req.body;
        
        const lab = await laboratoryModel.findById(labId);
        if (!lab) {
            return res.status(404).json({
                success: false,
                message: "Laboratory not found"
            });
        }

        // Check if test code already exists
        const existingTest = lab.services.find(test => test.testCode === testCode);
        if (existingTest) {
            return res.status(400).json({
                success: false,
                message: "Test with this code already exists in this laboratory"
            });
        }

        const newTest = {
            testName,
            testCode,
            category,
            description,
            price,
            duration,
            requirements: requirements || [],
            preparation: preparation || "",
            isActive: true
        };

        lab.services.push(newTest);
        await lab.save();

        res.status(201).json({
            success: true,
            message: "Lab test created successfully",
            data: newTest
        });

    } catch (error) {
        console.error("Create lab test error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create lab test",
            error: error.message
        });
    }
};

// Update lab test
const updateLabTest = async (req, res) => {
    try {
        const { labId, testId } = req.params;
        const updates = req.body;

        const lab = await laboratoryModel.findById(labId);
        if (!lab) {
            return res.status(404).json({
                success: false,
                message: "Laboratory not found"
            });
        }

        const testIndex = lab.services.findIndex(test => test._id.toString() === testId);
        if (testIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Test not found"
            });
        }

        // Update test
        Object.assign(lab.services[testIndex], updates);
        await lab.save();

        res.json({
            success: true,
            message: "Lab test updated successfully",
            data: lab.services[testIndex]
        });

    } catch (error) {
        console.error("Update lab test error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update lab test",
            error: error.message
        });
    }
};

// Get all lab tests (with filtering)
const getLabTests = async (req, res) => {
    try {
        const { labId, category, active } = req.query;
        
        let filter = {};
        if (labId) filter._id = labId;
        if (active !== undefined) filter['services.isActive'] = active === 'true';

        const laboratories = await laboratoryModel.find(filter)
            .select('name labCode services')
            .lean();

        let allTests = [];
        laboratories.forEach(lab => {
            lab.services.forEach(test => {
                if (!category || test.category === category) {
                    allTests.push({
                        ...test,
                        labName: lab.name,
                        labCode: lab.labCode,
                        labId: lab._id
                    });
                }
            });
        });

        res.json({
            success: true,
            data: allTests,
            count: allTests.length
        });

    } catch (error) {
        console.error("Get lab tests error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch lab tests",
            error: error.message
        });
    }
};

// Report Management Controllers

// Generate lab report
const generateLabReport = async (req, res) => {
    try {
        const { labResultId } = req.params;
        const { overallStatus, summary, recommendations, followUpRequired, followUpDate } = req.body;

        const labResult = await labResultModel.findById(labResultId)
            .populate('patientId', 'name email')
            .populate('testId', 'testName testCode')
            .populate('labId', 'name')
            .populate('doctorId', 'name');

        if (!labResult) {
            return res.status(404).json({
                success: false,
                message: "Lab result not found"
            });
        }

        // Create report
        const report = new reportModel({
            patientId: labResult.patientId._id,
            testId: labResult.testId._id,
            labResultId: labResult._id,
            labId: labResult.labId._id,
            doctorId: labResult.doctorId._id,
            technicianId: labResult.technicianId,
            overallStatus,
            summary,
            recommendations: recommendations || [],
            followUpRequired: followUpRequired || false,
            followUpDate,
            generatedBy: req.user.id,
            sampleDate: labResult.scheduledDate,
            sections: [{
                sectionName: labResult.testId.testName,
                results: [{
                    testName: labResult.testId.testName,
                    value: labResult.resultData.patientValue,
                    normalRange: labResult.resultData.normalRange,
                    unit: labResult.resultData.unit,
                    status: labResult.resultData.status,
                    notes: labResult.resultData.notes
                }],
                summary: `${labResult.testId.testName} test results`,
                impression: overallStatus
            }]
        });

        await report.save();

        // Update lab result status
        labResult.status = 'Completed';
        labResult.completedDate = new Date();
        await labResult.save();

        res.status(201).json({
            success: true,
            message: "Lab report generated successfully",
            data: report
        });

    } catch (error) {
        console.error("Generate lab report error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to generate lab report",
            error: error.message
        });
    }
};

// Get lab reports
const getLabReports = async (req, res) => {
    try {
        const { patientId, doctorId, labId, status, dateFrom, dateTo } = req.query;
        
        let filter = {};
        if (patientId) filter.patientId = patientId;
        if (doctorId) filter.doctorId = doctorId;
        if (labId) filter.labId = labId;
        if (status) filter.status = status;
        
        if (dateFrom || dateTo) {
            filter.reportDate = {};
            if (dateFrom) filter.reportDate.$gte = new Date(dateFrom);
            if (dateTo) filter.reportDate.$lte = new Date(dateTo);
        }

        const reports = await reportModel.find(filter)
            .populate('patientId', 'name email')
            .populate('testId', 'testName testCode')
            .populate('labId', 'name')
            .populate('doctorId', 'name')
            .populate('generatedBy', 'name')
            .sort({ reportDate: -1 });

        res.json({
            success: true,
            data: reports,
            count: reports.length
        });

    } catch (error) {
        console.error("Get lab reports error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch lab reports",
            error: error.message
        });
    }
};

// Upload report PDF
const uploadReportPDF = async (req, res) => {
    try {
        const { reportId } = req.params;
        
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No file uploaded"
            });
        }

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            resource_type: 'raw',
            folder: 'lab-reports',
            public_id: `report-${reportId}`
        });

        // Update report with file URL
        const report = await reportModel.findByIdAndUpdate(
            reportId,
            { 
                reportUrl: result.secure_url,
                status: 'Sent',
                sentDate: new Date()
            },
            { new: true }
        );

        // Clean up temporary file
        fs.unlinkSync(req.file.path);

        res.json({
            success: true,
            message: "Report uploaded successfully",
            data: {
                reportUrl: result.secure_url,
                report
            }
        });

    } catch (error) {
        console.error("Upload report PDF error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to upload report",
            error: error.message
        });
    }
};

// Billing Management Controllers

// Create lab billing
const createLabBilling = async (req, res) => {
    try {
        const { patientId, doctorId, labId, items, paymentMethod, dueDate, insuranceInfo, notes } = req.body;

        // Calculate totals
        let subtotal = 0;
        const billingItems = items.map(item => {
            const itemSubtotal = item.price * item.quantity;
            subtotal += itemSubtotal;
            return {
                ...item,
                subtotal: itemSubtotal
            };
        });

        const discount = req.body.discount || 0;
        const tax = req.body.tax || 0;
        const totalAmount = subtotal - discount + tax;

        // Create billing
        const billing = new billingModel({
            patientId,
            doctorId,
            labId,
            items: billingItems,
            subtotal,
            discount,
            tax,
            totalAmount,
            paymentMethod: paymentMethod || 'Cash',
            dueDate: dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            insuranceInfo,
            notes,
            createdBy: req.user.id
        });

        await billing.save();

        res.status(201).json({
            success: true,
            message: "Lab billing created successfully",
            data: billing
        });

    } catch (error) {
        console.error("Create lab billing error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to create lab billing",
            error: error.message
        });
    }
};

// Get lab billings
const getLabBillings = async (req, res) => {
    try {
        const { patientId, labId, status, paymentStatus, dateFrom, dateTo } = req.query;
        
        let filter = {};
        if (patientId) filter.patientId = patientId;
        if (labId) filter.labId = labId;
        if (status) filter.status = status;
        if (paymentStatus) filter.paymentStatus = paymentStatus;
        
        if (dateFrom || dateTo) {
            filter.billingDate = {};
            if (dateFrom) filter.billingDate.$gte = new Date(dateFrom);
            if (dateTo) filter.billingDate.$lte = new Date(dateTo);
        }

        const billings = await billingModel.find(filter)
            .populate('patientId', 'name email')
            .populate('doctorId', 'name')
            .populate('labId', 'name')
            .populate('createdBy', 'name')
            .sort({ billingDate: -1 });

        res.json({
            success: true,
            data: billings,
            count: billings.length
        });

    } catch (error) {
        console.error("Get lab billings error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch lab billings",
            error: error.message
        });
    }
};

// Update payment status
const updatePaymentStatus = async (req, res) => {
    try {
        const { billingId } = req.params;
        const { paymentStatus, paidAmount, paymentMethod, notes } = req.body;

        const billing = await billingModel.findById(billingId);
        if (!billing) {
            return res.status(404).json({
                success: false,
                message: "Billing not found"
            });
        }

        // Update payment information
        billing.paymentStatus = paymentStatus;
        if (paidAmount !== undefined) billing.paidAmount = paidAmount;
        if (paymentMethod) billing.paymentMethod = paymentMethod;
        if (paymentStatus === 'Paid') {
            billing.paidDate = new Date();
            billing.status = 'Paid';
        }
        if (notes) billing.notes = notes;
        
        billing.updatedBy = req.user.id;
        await billing.save();

        res.json({
            success: true,
            message: "Payment status updated successfully",
            data: billing
        });

    } catch (error) {
        console.error("Update payment status error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update payment status",
            error: error.message
        });
    }
};

// Permission Matrix Controllers

// Get permission matrix
const getPermissionMatrix = async (req, res) => {
    try {
        const { role } = req.params;
        
        const permissions = await permissionMatrixModel.find({ role })
            .sort({ module: 1 });

        // Group by module
        const groupedPermissions = {};
        permissions.forEach(perm => {
            if (!groupedPermissions[perm.module]) {
                groupedPermissions[perm.module] = {};
            }
            groupedPermissions[perm.module] = perm.permissions;
        });

        res.json({
            success: true,
            data: groupedPermissions,
            role
        });

    } catch (error) {
        console.error("Get permission matrix error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch permission matrix",
            error: error.message
        });
    }
};

// Update permission matrix
const updatePermissionMatrix = async (req, res) => {
    try {
        const { role } = req.params;
        const { modules } = req.body; // { module: { create: true, read: false, ... } }

        for (const [module, permissions] of Object.entries(modules)) {
            await permissionMatrixModel.findOneAndUpdate(
                { role, module },
                { 
                    permissions, 
                    lastUpdated: new Date(), 
                    updatedBy: req.user.id 
                },
                { upsert: true, new: true }
            );
        }

        res.json({
            success: true,
            message: "Permission matrix updated successfully"
        });

    } catch (error) {
        console.error("Update permission matrix error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update permission matrix",
            error: error.message
        });
    }
};

export {
    // Test Management
    createLabTest,
    updateLabTest,
    getLabTests,
    
    // Report Management
    generateLabReport,
    getLabReports,
    uploadReportPDF,
    
    // Billing Management
    createLabBilling,
    getLabBillings,
    updatePaymentStatus,
    
    // Permission Matrix
    getPermissionMatrix,
    updatePermissionMatrix
};
