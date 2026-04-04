import mongoose from "mongoose";
import bcrypt from "bcrypt";

const superAdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'super_admin', enum: ['super_admin'] },
    permissions: [{
        module: { type: String, required: true },
        actions: [{ type: String }] // create, read, update, delete
    }],
    department: { type: String, default: 'System Administration' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    loginAttempts: { type: Number, default: 0 },
    lockUntil: { type: Date },
    created: { type: Date, default: Date.now },
    updated: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// Password hashing middleware
superAdminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    next();
});

// Password comparison method
superAdminSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Account lockout method
superAdminSchema.methods.incLoginAttempts = function() {
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
superAdminSchema.virtual('isLocked').get(function() {
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

const superAdminModel = mongoose.models.superAdmin || mongoose.model("superAdmin", superAdminSchema);
export default superAdminModel;
