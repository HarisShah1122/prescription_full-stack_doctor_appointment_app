const { spawn } = require('child_process');
const http = require('http');

const FRONTEND_PORT = 5174;
const BACKEND_PORT = 4000;

// Function to check if a server is running
function checkServer(port, callback) {
    const options = {
        hostname: 'localhost',
        port: port,
        path: '/',
        method: 'GET',
        timeout: 2000
    };

    const req = http.request(options, (res) => {
        callback(res.statusCode === 200);
    });

    req.on('error', () => {
        callback(false);
    });

    req.on('timeout', () => {
        callback(false);
    });

    req.end();
}

// Function to start frontend server
function startFrontend() {
    console.log('🚀 Starting frontend server...');
    
    const frontend = spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        shell: true,
        cwd: __dirname
    });

    frontend.on('close', (code) => {
        console.log(`Frontend server exited with code ${code}`);
        if (code !== 0) {
            console.log('🔄 Restarting frontend server in 3 seconds...');
            setTimeout(startFrontend, 3000);
        }
    });
}

// Function to start backend server
function startBackend() {
    console.log('🚀 Starting backend server...');
    
    const backend = spawn('npm', ['start'], {
        stdio: 'inherit',
        shell: true,
        cwd: '../backend'
    });

    backend.on('close', (code) => {
        console.log(`Backend server exited with code ${code}`);
        if (code !== 0) {
            console.log('🔄 Restarting backend server in 3 seconds...');
            setTimeout(startBackend, 3000);
        }
    });
}

// Monitor servers and restart if needed
function monitorServers() {
    checkServer(FRONTEND_PORT, (isRunning) => {
        if (!isRunning) {
            console.log('❌ Frontend server is down, restarting...');
            startFrontend();
        }
    });

    checkServer(BACKEND_PORT, (isRunning) => {
        if (!isRunning) {
            console.log('❌ Backend server is down, restarting...');
            startBackend();
        }
    });
}

// Start monitoring
console.log('📡 Server monitoring started...');
console.log(`🌐 Frontend: http://localhost:${FRONTEND_PORT}`);
console.log(`🔧 Backend: http://localhost:${BACKEND_PORT}`);
console.log('🔄 Auto-restoration enabled');

// Check servers every 10 seconds
setInterval(monitorServers, 10000);

// Initial check
monitorServers();
