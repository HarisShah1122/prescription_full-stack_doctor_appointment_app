#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🚀 Starting Secure Authentication Server...');
console.log('=====================================');

// Check environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGO_URI'];
const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingVars.length > 0) {
  console.log('❌ Missing required environment variables:');
  missingVars.forEach(varName => console.log(`   - ${varName}`));
  console.log('\n📝 Please set these in your .env file');
  process.exit(1);
}

console.log('✅ Environment variables configured');

// Start the server
const serverProcess = spawn('node', ['server.js'], {
  stdio: 'inherit',
  cwd: __dirname,
  env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'development' }
});

serverProcess.on('error', (error) => {
  console.error('❌ Failed to start server:', error.message);
  process.exit(1);
});

serverProcess.on('exit', (code) => {
  console.log(`🛑 Server exited with code: ${code}`);
  process.exit(code);
});

console.log('🌐 Server starting...');
console.log('📊 Health check: http://localhost:4000/health');
console.log('🔐 Authentication: http://localhost:4000/api/user/login');
console.log('📚 API Documentation: ./SECURE_AUTHENTICATION_GUIDE.md');
console.log('=====================================');

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Received SIGINT, shutting down gracefully...');
  serverProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...');
  serverProcess.kill('SIGTERM');
});
