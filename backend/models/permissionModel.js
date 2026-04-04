import mongoose from "mongoose";

// Permission definitions
const permissionSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    module: { type: String, required: true },
    action: { type: String, required: true }, // create, read, update, delete, manage
    resource: { type: String }, // specific resource within module
    isActive: { type: Boolean, default: true }
}, {
    timestamps: true
});

// Role-Permission mapping
const rolePermissionSchema = new mongoose.Schema({
    role: { 
        type: String, 
        enum: ['super_admin', 'admin', 'doctor', 'patient', 'lab_technician'], 
        required: true 
    },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
    isActive: { type: Boolean, default: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    updated: { type: Date, default: Date.now }
}, {
    timestamps: true
});

// User-specific permissions (for custom permissions)
const userPermissionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    permissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Permission' }],
    grantedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    grantedAt: { type: Date, default: Date.now },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
    notes: { type: String }
}, {
    timestamps: true
});

// Permission Matrix for easy lookup
const permissionMatrixSchema = new mongoose.Schema({
    role: { type: String, required: true },
    module: { type: String, required: true },
    permissions: {
        create: { type: Boolean, default: false },
        read: { type: Boolean, default: false },
        update: { type: Boolean, default: false },
        delete: { type: Boolean, default: false },
        manage: { type: Boolean, default: false },
        approve: { type: Boolean, default: false },
        export: { type: Boolean, default: false }
    },
    restrictions: [{ type: String }], // Additional restrictions
    lastUpdated: { type: Date, default: Date.now },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }
}, {
    timestamps: true
});

const permissionModel = mongoose.models.Permission || mongoose.model("Permission", permissionSchema);
const rolePermissionModel = mongoose.models.RolePermission || mongoose.model("RolePermission", rolePermissionSchema);
const userPermissionModel = mongoose.models.UserPermission || mongoose.model("UserPermission", userPermissionSchema);
const permissionMatrixModel = mongoose.models.PermissionMatrix || mongoose.model("PermissionMatrix", permissionMatrixSchema);

export { permissionModel, rolePermissionModel, userPermissionModel, permissionMatrixModel };
