import mongoose from "mongoose";

const billingItemSchema = new mongoose.Schema({
    testId: { type: mongoose.Schema.Types.ObjectId, ref: 'labTest', required: true },
    testName: { type: String, required: true },
    testCode: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, default: 1 },
    discount: { type: Number, default: 0 },
    subtotal: { type: Number, required: true }
});

const billingSchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'doctor', required: true },
    labId: { type: mongoose.Schema.Types.ObjectId, ref: 'laboratory', required: true },
    billingNumber: { type: String, required: true, unique: true },
    items: [billingItemSchema],
    
    // Pricing
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    
    // Payment
    paymentStatus: { 
        type: String, 
        enum: ['Pending', 'Partial', 'Paid', 'Overdue', 'Cancelled'], 
        default: 'Pending' 
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card', 'Insurance', 'Online', 'Bank Transfer'],
        default: 'Cash'
    },
    paidAmount: { type: Number, default: 0 },
    dueDate: { type: Date, required: true },
    
    // Status
    status: {
        type: String,
        enum: ['Draft', 'Sent', 'Paid', 'Overdue', 'Cancelled'],
        default: 'Draft'
    },
    
    // Dates
    billingDate: { type: Date, default: Date.now },
    dueDate: { type: Date, required: true },
    paidDate: { type: Date },
    
    // Insurance
    insuranceInfo: {
        provider: { type: String },
        policyNumber: { type: String },
        coverageAmount: { type: Number },
        claimStatus: { type: String, enum: ['Pending', 'Approved', 'Rejected', 'Processed'] }
    },
    
    // Notes
    notes: { type: String },
    internalNotes: { type: String },
    
    // Audit
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Generate billing number
billingSchema.pre('save', async function(next) {
    if (!this.billingNumber) {
        const count = await this.constructor.countDocuments();
        this.billingNumber = `BILL-${String(count + 1).padStart(6, '0')}`;
    }
    next();
});

const billingModel = mongoose.models.billing || mongoose.model("billing", billingSchema);
export default billingModel;
