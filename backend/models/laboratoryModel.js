import mongoose from "mongoose";

const labTestSchema = new mongoose.Schema({
    testName: { type: String, required: true },
    testCode: { type: String, required: true, unique: true },
    category: { type: String, required: true }, // Blood, Urine, Imaging, etc.
    description: { type: String },
    price: { type: Number, required: true },
    duration: { type: String, required: true }, // "24 hours", "2-3 days"
    requirements: [{ type: String }], // Fasting, etc.
    isActive: { type: Boolean, default: true }
});

const labResultSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true },
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'labTest', required: true },
    labId: { type: mongoose.Schema.Types.ObjectId, ref: 'laboratory', required: true },
    resultData: {
        normalRange: { type: String },
        patientValue: { type: String },
        unit: { type: String },
        status: { type: String, enum: ['Normal', 'Abnormal', 'Critical'], required: true },
        notes: { type: String }
    },
    reportUrl: { type: String }, // Cloudinary URL for PDF report
    status: { type: String, enum: ['Pending', 'Processing', 'Completed', 'Cancelled'], default: 'Pending' },
    scheduledDate: { type: Date, required: true },
    completedDate: { type: Date },
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'labTechnician' },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
});

const laboratorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    labCode: { type: String, required: true, unique: true },
    type: { type: String, enum: ['Diagnostic', 'Pathology', 'Imaging', 'Specialized'], required: true },
    location: {
        building: { type: String, required: true },
        floor: { type: String },
        room: { type: String }
    },
    contact: {
        phone: { type: String, required: true },
        email: { type: String },
        extension: { type: String }
    },
    operatingHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String }
    },
    services: [labTestSchema],
    equipment: [{
        name: { type: String, required: true },
        model: { type: String },
        serialNumber: { type: String },
        maintenanceDate: { type: Date },
        status: { type: String, enum: ['Active', 'Maintenance', 'Out of Order'], default: 'Active' }
    }],
    staff: [{
        technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'labTechnician' },
        role: { type: String, enum: ['Technician', 'Supervisor', 'Manager'] },
        joinDate: { type: Date, default: Date.now }
    }],
    isActive: { type: Boolean, default: true },
    managedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin' },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const labTechnicianSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'lab_technician' },
    specialization: [{ type: String }], // Hematology, Microbiology, etc.
    certification: [{
        name: { type: String },
        issuedBy: { type: String },
        issuedDate: { type: Date },
        expiryDate: { type: Date }
    }],
    labId: { type: mongoose.Schema.Types.ObjectId, ref: 'laboratory', required: true },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
}, {
    timestamps: true
});

const labTestModel = mongoose.models.labTest || mongoose.model("labTest", labTestSchema);
const labResultModel = mongoose.models.labResult || mongoose.model("labResult", labResultSchema);
const laboratoryModel = mongoose.models.laboratory || mongoose.model("laboratory", laboratorySchema);
const labTechnicianModel = mongoose.models.labTechnician || mongoose.model("labTechnician", labTechnicianSchema);

export { labTestModel, labResultModel, laboratoryModel, labTechnicianModel };
