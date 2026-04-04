import superAdminModel from '../models/superAdminModel.js';
import adminModel from '../models/adminModel.js';
import bcrypt from 'bcrypt';

const createDefaultSuperAdmin = async () => {
  try {
    // Check if super admin already exists
    const existingSuperAdmin = await superAdminModel.findOne({ email: 'superadmin@medical.com' });
    
    if (!existingSuperAdmin) {
      // Create default super admin
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const superAdmin = new superAdminModel({
        name: 'Super Admin',
        email: 'superadmin@medical.com',
        password: hashedPassword,
        role: 'super_admin',
        department: 'System Administration',
        permissions: [
          { module: 'system', actions: ['create', 'read', 'update', 'delete'] },
          { module: 'users', actions: ['create', 'read', 'update', 'delete'] },
          { module: 'doctors', actions: ['create', 'read', 'update', 'delete'] },
          { module: 'laboratory', actions: ['create', 'read', 'update', 'delete'] },
          { module: 'appointments', actions: ['create', 'read', 'update', 'delete'] },
          { module: 'billing', actions: ['create', 'read', 'update', 'delete'] },
          { module: 'reports', actions: ['create', 'read', 'update', 'delete'] }
        ],
        isActive: true
      });

      await superAdmin.save();
      console.log('✅ Default Super Admin created successfully');
      console.log('📧 Email: superadmin@medical.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('ℹ️ Super Admin already exists');
    }

    // Check if admin already exists
    const existingAdmin = await adminModel.findOne({ email: 'admin@medical.com' });
    
    if (!existingAdmin) {
      // Create default admin
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const admin = new adminModel({
        name: 'Admin User',
        email: 'admin@medical.com',
        password: hashedPassword,
        role: 'admin',
        department: 'Hospital Administration',
        permissions: [
          { module: 'doctors', actions: ['create', 'read', 'update', 'delete'] },
          { module: 'laboratory', actions: ['create', 'read', 'update', 'delete'] },
          { module: 'appointments', actions: ['read', 'update'] },
          { module: 'billing', actions: ['create', 'read', 'update'] },
          { module: 'reports', actions: ['read', 'create'] }
        ],
        isActive: true
      });

      await admin.save();
      console.log('✅ Default Admin created successfully');
      console.log('📧 Email: admin@medical.com');
      console.log('🔑 Password: admin123');
    } else {
      console.log('ℹ️ Admin already exists');
    }

  } catch (error) {
    console.error('❌ Error creating default accounts:', error);
  }
};

export default createDefaultSuperAdmin;
