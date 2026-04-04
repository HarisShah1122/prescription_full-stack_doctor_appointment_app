import mongoose from "mongoose";
import bcrypt from "bcrypt";

const adminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'admin', enum: ['admin'] },
    permissions: [{
        module: { type: String, required: true },
        actions: [{ type: String }] // create, read, update, delete
    }],
    department: { type: String, required: true }, // e.g., 'Doctor Management', 'Laboratory', 'Appointments'
    specialization: { type: String }, // e.g., 'HR', 'Operations', 'Lab Management'
    isActive: { type: Boolean, default: true },
    managedDoctors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'doctor' }],
    managedLabs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'laboratory' }],
    lastLogin: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'superAdmin' }
}, {
    timestamps: true
});

// Password hashing middleware
adminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Password comparison method
adminSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Account lockout method
adminSchema.methods.incLoginAttempts = function() {
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.updateOne({
            $unset: { lockUntil: 1, loginAttempts: 1 }
        });
    }
    
    const updates = { $inc: { loginAttempts: 1 } };
    if (this.loginAttempts + 1 >= 5 && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
    }
    
    return this.updateOne(updates);
};

// Virtual for checking if account is locked
adminSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

const adminModel = mongoose.models.admin || mongoose.model("admin", adminSchema);
export default adminModel;
