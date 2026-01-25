# MMC Mardan Medical Complex - Auto-Restart Frontend Server
Write-Host "🚀 Starting MMC Mardan Medical Complex Frontend with Auto-Restoration..." -ForegroundColor Green
Write-Host "📝 Server will automatically restart if it crashes" -ForegroundColor Yellow
Write-Host "🌐 Frontend will be available at: http://localhost:5173/" -ForegroundColor Cyan
Write-Host "⚡ Press Ctrl+C to stop the server" -ForegroundColor Red
Write-Host ""

# Change to the frontend directory
Set-Location $PSScriptRoot

# Start the auto-restoration server
npm run dev-auto
