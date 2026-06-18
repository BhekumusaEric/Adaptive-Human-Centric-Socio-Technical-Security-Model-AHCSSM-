<#
.SYNOPSIS
    ACASTM Quick-Start Script
    Run this every time you want to start the application after initial setup.

.USAGE
    Right-click this file -> "Run with PowerShell"
    OR open PowerShell and run: .\start.ps1
#>

$BACKEND_DIR  = "$PSScriptRoot\backend_node"
$FRONTEND_DIR = "$PSScriptRoot\frontend"
$BACKEND_PORT = 8000
$FRONTEND_PORT = 5173
$APP_URL = "http://localhost:$FRONTEND_PORT"

Clear-Host
Write-Host ""
Write-Host "  ╔══════════════════════════════════════════════════╗" -ForegroundColor White
Write-Host "  ║         ACASTM - QUICK START                     ║" -ForegroundColor White
Write-Host "  ╚══════════════════════════════════════════════════╝" -ForegroundColor White
Write-Host ""

# Check that node_modules exist (i.e. setup has been run)
if (-Not (Test-Path "$BACKEND_DIR\node_modules")) {
    Write-Host "  [!] Backend dependencies missing. Running setup first..." -ForegroundColor Yellow
    Write-Host "      Please run setup.ps1 instead." -ForegroundColor Yellow
    Read-Host "  Press ENTER to exit"
    exit 1
}
if (-Not (Test-Path "$FRONTEND_DIR\node_modules")) {
    Write-Host "  [!] Frontend dependencies missing. Running setup first..." -ForegroundColor Yellow
    Write-Host "      Please run setup.ps1 instead." -ForegroundColor Yellow
    Read-Host "  Press ENTER to exit"
    exit 1
}

Write-Host "  [..] Starting backend on port $BACKEND_PORT..." -ForegroundColor Gray
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$BACKEND_DIR'; Write-Host '  ACASTM Backend Running on http://localhost:$BACKEND_PORT' -ForegroundColor Green; Write-Host ''; npm start"
)

Start-Sleep -Seconds 2

Write-Host "  [..] Starting frontend on port $FRONTEND_PORT..." -ForegroundColor Gray
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$FRONTEND_DIR'; Write-Host '  ACASTM Frontend Running on $APP_URL' -ForegroundColor Green; Write-Host ''; npm run dev"
)

Write-Host "  [..] Waiting for servers to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 5

Write-Host "  [OK] Opening application in browser..." -ForegroundColor Green
Start-Process $APP_URL

Write-Host ""
Write-Host "  Application is live at: $APP_URL" -ForegroundColor White
Write-Host ""
Read-Host "  Press ENTER to close this window"
