import mongoose from "mongoose";

// Import models directly
const laboratoryModel = mongoose.models.laboratory || mongoose.model("laboratory", new mongoose.Schema({}));
const labResultModel = mongoose.models.labResult || mongoose.model("labResult", new mongoose.Schema({}));
const reportModel = mongoose.models.report || mongoose.model("report", new mongoose.Schema({}));
const billingModel = mongoose.models.billing || mongoose.model("billing", new mongoose.Schema({}));

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

// Get laboratory statistics
const getLabStats = async (req, res) => {
    try {
        const [
            totalLabs,
            totalTests,
            totalResults,
            totalReports,
            totalBilling,
            pendingReports,
            pendingBilling
        ] = await Promise.all([
            laboratoryModel.countDocuments({ isActive: true }),
            laboratoryModel.aggregate([
                { $unwind: '$services' },
                { $match: { 'services.isActive': true } },
                { $count: 'total' }
            ]),
            labResultModel.countDocuments(),
            reportModel.countDocuments(),
            billingModel.countDocuments(),
            reportModel.countDocuments({ status: { $in: ['Draft', 'Pending Review'] } }),
            billingModel.countDocuments({ paymentStatus: 'Pending' })
        ]);

        res.json({
            success: true,
            data: {
                laboratories: totalLabs,
                tests: totalTests[0]?.total || 0,
                results: totalResults,
                reports: totalReports,
                billing: totalBilling,
                pendingReports,
                pendingBilling
            }
        });

    } catch (error) {
        console.error("Lab stats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch laboratory statistics",
            error: error.message
        });
    }
};

export {
    getLabTests,
    getLabReports,
    getLabBillings,
    getLabStats
};
