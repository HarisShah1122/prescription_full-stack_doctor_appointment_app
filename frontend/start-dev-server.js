const { spawn } = require('child_process');
const path = require('path');

// Function to start the dev server
function startDevServer() {
    console.log('🚀 Starting Vite development server...');
    
    const devServer = spawn('npm', ['run', 'dev'], {
        stdio: 'inherit',
        shell: true,
        cwd: __dirname
    });

    devServer.on('close', (code) => {
        console.log(`Development server exited with code ${code}`);
        
        // Restart the server if it crashes (exit code not 0)
        if (code !== 0) {
            console.log('🔄 Server crashed, restarting in 3 seconds...');
            setTimeout(() => {
                startDevServer();
            }, 3000);
        }
    });

    devServer.on('error', (error) => {
        console.error('Failed to start development server:', error);
        setTimeout(() => {
            startDevServer();
        }, 3000);
    });
}

// Start the server
startDevServer();

console.log('📝 Auto-restoration enabled - Server will restart automatically if it crashes');
console.log('🌐 Frontend will be available at: http://localhost:5173/');
console.log('⚡ Press Ctrl+C to stop the server');
