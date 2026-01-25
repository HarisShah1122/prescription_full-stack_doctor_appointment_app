@echo off
echo 🚀 Starting MMC Mardan Medical Complex Frontend with Auto-Restoration...
echo 📝 Server will automatically restart if it crashes
echo 🌐 Frontend will be available at: http://localhost:5173/
echo ⚡ Press Ctrl+C to stop the server
echo.

cd /d "%~dp0"
npm run dev-auto

pause
