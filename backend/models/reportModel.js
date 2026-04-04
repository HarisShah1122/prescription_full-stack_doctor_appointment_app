import mongoose from "mongoose";

const reportSectionSchema = new mongoose.Schema({
    sectionName: { type: String, required: true },
    results: [{
        testName: { type: String, required: true },
        value: { type: String, required: true },
        normalRange: { type: String },
        unit: { type: String },
        status: { 
            type: String, 
            enum: ['Normal', 'Abnormal', 'Critical', 'Borderline'], 
            required: true 
        },
        notes: { type: String },
        flags: [{
            type: String,
            enum: ['High', 'Low', 'Critical', 'Pending', 'Review']
        }]
    }],
    summary: { type: String },
    impression: { type: String }
});

const reportSchema = new mongoose.Schema({
    reportNumber: { type: String, required: true, unique: true },
    
    // Patient and Test Information
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'labTest', required: true },
    labResultId: { type: mongoose.Schema.Types.ObjectId, ref: 'labResult', required: true },
    labId: { type: mongoose.Schema.Types.ObjectId, ref: 'laboratory', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true },
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'labTechnician' },
    
    // Report Content
    reportType: {
        type: String,
        enum: ['Standard', 'Urgent', 'Comprehensive', 'Follow-up'],
        default: 'Standard'
    },
    sections: [reportSectionSchema],
    
    // Overall Assessment
    overallStatus: {
        type: String,
        enum: ['Normal', 'Abnormal', 'Critical', 'Pending'],
        required: true
    },
    summary: { type: String, required: true },
    recommendations: [{ type: String }],
    followUpRequired: { type: Boolean, default: false },
    followUpDate: { type: Date },
    
    // Report Generation
    generatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'labTechnician', required: true },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor' },
    
    // Status and Workflow
    status: {
        type: String,
        enum: ['Draft', 'Pending Review', 'Reviewed', 'Approved', 'Sent', 'Corrected'],
        default: 'Draft'
    },
    
    // Dates
    sampleDate: { type: Date, required: true },
    reportDate: { type: Date, default: Date.now },
    reviewDate: { type: Date },
    approvalDate: { type: Date },
    sentDate: { type: Date },
    
    // Delivery
    deliveryMethod: {
        type: String,
        enum: ['Email', 'Portal', 'Print', 'Courier', 'In Person'],
        default: 'Portal'
    },
    deliveryStatus: {
        type: String,
        enum: ['Pending', 'Sent', 'Delivered', 'Failed'],
        default: 'Pending'
    },
    
    // Files and Attachments
    reportUrl: { type: String }, // Cloudinary URL for PDF
    attachments: [{
        type: String,
        description: String,
        uploadDate: { type: Date, default: Date.now }
    }],
    
    // Quality Control
    qualityChecks: [{
        checkType: { type: String, required: true },
        result: { type: String, enum: ['Pass', 'Fail', 'Warning'], required: true },
        checkedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'labTechnician' },
        checkedAt: { type: Date, default: Date.now },
        notes: { type: String }
    }],
    
    // Comments and Notes
    internalComments: [{ type: String, addedBy: Date, addedByUser: mongoose.Schema.Types.ObjectId }],
    patientComments: { type: String },
    doctorComments: { type: String },
    
    // Audit
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Generate report number
reportSchema.pre('save', async function(next) {
    if (!this.reportNumber) {
        const count = await this.constructor.countDocuments();
        this.reportNumber = `RPT-${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

const reportModel = mongoose.models.report || mongoose.model("report", reportSchema);
export default reportModel;
