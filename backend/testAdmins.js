import mongoose from 'mongoose';
import superAdminModel from './models/superAdminModel.js';
import adminModel from './models/adminModel.js';
import bcrypt from 'bcrypt';

// Test admin accounts
const testAdminAccounts = async () => {
  try {
    // Use hardcoded connection for testing
    const mongoURI = process.env.MONGODB_URL || 'mongodb://127.0.0.1:27017/prescription_full-stack_doctor';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Check super admin
    const superAdmin = await superAdminModel.findOne({ email: 'superadmin@medical.com' });
    console.log('Super Admin:', superAdmin ? 'Found' : 'Not found');

    // Check admin
    const admin = await adminModel.findOne({ email: 'admin@medical.com' });
    console.log('Admin:', admin ? 'Found' : 'Not found');

    // Test password comparison if accounts exist
    if (superAdmin) {
      const isMatch = await superAdmin.comparePassword('admin123');
      console.log('Super Admin password match:', isMatch);
    }

    if (admin) {
      const isMatch = await admin.comparePassword('admin123');
      console.log('Admin password match:', isMatch);
    }

    // Create accounts if they don't exist
    if (!superAdmin) {
      console.log('Creating Super Admin...');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const newSuperAdmin = new superAdminModel({
        name: 'Super Admin',
        email: 'superadmin@medical.com',
        password: hashedPassword,
        role: 'super_admin',
        department: 'System Administration',
        isActive: true
      });
      await newSuperAdmin.save();
      console.log('Super Admin created successfully');
    }

    if (!admin) {
      console.log('Creating Admin...');
      const hashedPassword = await bcrypt.hash('admin123', 12);
      const newAdmin = new adminModel({
        name: 'Admin User',
        email: 'admin@medical.com',
        password: hashedPassword,
        role: 'admin',
        department: 'Hospital Administration',
        isActive: true
      });
      await newAdmin.save();
      console.log('Admin created successfully');
    }

    console.log('Test completed');
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

testAdminAccounts();
