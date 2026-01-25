import dotenv from 'dotenv';
import { config } from 'dotenv';

// Load environment variables
dotenv.config();

console.log('=== MMC Mardan Medical Complex - Admin Debug ===');
console.log('Admin Email:', process.env.ADMIN_EMAIL || 'NOT SET');
console.log('Admin Password:', process.env.ADMIN_PASSWORD ? '***SET***' : 'NOT SET');
console.log('JWT Secret:', process.env.JWT_SECRET ? '***SET***' : 'NOT SET');
console.log('Backend URL:', process.env.VITE_BACKEND_URL || 'http://localhost:4000');
console.log('=====================================');

// Test admin login with environment variables
const testAdminLogin = async () => {
    try {
        const response = await fetch('http://localhost:4000/api/admin/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: 'admin@mmc.com',
                password: 'admin123'
            })
        });

        const data = await response.json();
        console.log('Login Test Result:', data);
        
        if (data.success) {
            console.log('✅ Admin login successful!');
            console.log('Token:', data.token.substring(0, 50) + '...');
        } else {
            console.log('❌ Admin login failed:', data.message);
        }
    } catch (error) {
        console.error('❌ Login test error:', error.message);
    }
};

testAdminLogin();
