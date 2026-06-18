<#
.SYNOPSIS
    ACASTM One-Time Setup Script
    Adaptive Context-Aware Social Engineering Threat Mitigation Model

.DESCRIPTION
    Run this script ONCE on any new Windows machine to:
      1. Verify Node.js is installed
      2. Install all backend dependencies (backend_node/)
      3. Install all frontend dependencies (frontend/)
      4. Launch both servers in separate terminal windows
      5. Automatically open the application in your browser

.USAGE
    Right-click this file -> "Run with PowerShell"
    OR open PowerShell and run: .\setup.ps1
#>

# ─────────────────────────────────────────────────────────────
#  CONFIGURATION
# ─────────────────────────────────────────────────────────────
$APP_NAME    = "ACASTM Security Portal"
$BACKEND_DIR = "$PSScriptRoot\backend_node"
$FRONTEND_DIR = "$PSScriptRoot\frontend"
$BACKEND_PORT = 8000
$FRONTEND_PORT = 5173
$APP_URL = "http://localhost:$FRONTEND_PORT"

# ─────────────────────────────────────────────────────────────
#  HELPER FUNCTIONS
# ─────────────────────────────────────────────────────────────
function Write-Header {
    Clear-Host
    Write-Host ""
    Write-Host "  ╔══════════════════════════════════════════════════╗" -ForegroundColor White
    Write-Host "  ║         ACASTM - SETUP & LAUNCH SCRIPT          ║" -ForegroundColor White
    Write-Host "  ║  Adaptive Context-Aware Threat Mitigation Model  ║" -ForegroundColor Gray
    Write-Host "  ╚══════════════════════════════════════════════════╝" -ForegroundColor White
    Write-Host ""
}

function Write-Step($number, $text) {
    Write-Host "  [$number] $text" -ForegroundColor Cyan
}

function Write-Success($text) {
    Write-Host "  [OK] $text" -ForegroundColor Green
}

function Write-Fail($text) {
    Write-Host "  [ERROR] $text" -ForegroundColor Red
}

function Write-Info($text) {
    Write-Host "  [..] $text" -ForegroundColor Gray
}

# ─────────────────────────────────────────────────────────────
#  STEP 0: Show Header
# ─────────────────────────────────────────────────────────────
Write-Header

# ─────────────────────────────────────────────────────────────
#  STEP 1: Check Node.js
# ─────────────────────────────────────────────────────────────
Write-Step "1/4" "Checking Node.js installation..."

try {
    $nodeVersion = node --version 2>&1
    Write-Success "Node.js found: $nodeVersion"
} catch {
    Write-Fail "Node.js is NOT installed."
    Write-Host ""
    Write-Host "  Please install Node.js from: https://nodejs.org" -ForegroundColor Yellow
    Write-Host "  Download the LTS version, install it, then re-run this script." -ForegroundColor Yellow
    Write-Host ""
    Read-Host "  Press ENTER to open the Node.js download page and exit"
    Start-Process "https://nodejs.org/en/download"
    exit 1
}

try {
    $npmVersion = npm --version 2>&1
    Write-Success "npm found: v$npmVersion"
} catch {
    Write-Fail "npm not found. Please reinstall Node.js from https://nodejs.org"
    exit 1
}

Write-Host ""

# ─────────────────────────────────────────────────────────────
#  STEP 2: Install Backend Dependencies
# ─────────────────────────────────────────────────────────────
Write-Step "2/4" "Installing backend dependencies (backend_node/)..."

if (-Not (Test-Path $BACKEND_DIR)) {
    Write-Fail "backend_node/ directory not found. Are you running this from the project root?"
    exit 1
}

Set-Location $BACKEND_DIR
npm install --silent
if ($LASTEXITCODE -ne 0) {
    Write-Fail "Backend dependency installation failed."
    exit 1
}
Write-Success "Backend dependencies installed."
Set-Location $PSScriptRoot

Write-Host ""

# ─────────────────────────────────────────────────────────────
#  STEP 3: Install Frontend Dependencies
# ─────────────────────────────────────────────────────────────
Write-Step "3/4" "Installing frontend dependencies (frontend/)..."

if (-Not (Test-Path $FRONTEND_DIR)) {
    Write-Fail "frontend/ directory not found. Are you running this from the project root?"
    exit 1
}

Set-Location $FRONTEND_DIR
npm install --silent
if ($LASTEXITCODE -ne 0) {
    Write-Fail "Frontend dependency installation failed."
    exit 1
}
Write-Success "Frontend dependencies installed."
Set-Location $PSScriptRoot

Write-Host ""

# ─────────────────────────────────────────────────────────────
#  STEP 4: Launch Servers
# ─────────────────────────────────────────────────────────────
Write-Step "4/4" "Launching ACASTM servers..."

# Launch backend in a new PowerShell window
Write-Info "Starting Node.js backend on port $BACKEND_PORT..."
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$BACKEND_DIR'; Write-Host '  ACASTM Backend - Node.js Express Server' -ForegroundColor Cyan; Write-Host '  Running on http://localhost:$BACKEND_PORT' -ForegroundColor Green; Write-Host ''; npm start"
)

# Give the backend a moment to initialize
Start-Sleep -Seconds 2

# Launch frontend dev server in a new PowerShell window
Write-Info "Starting Vite frontend dev server on port $FRONTEND_PORT..."
Start-Process powershell -ArgumentList @(
    "-NoExit",
    "-Command",
    "Set-Location '$FRONTEND_DIR'; Write-Host '  ACASTM Frontend - Vite Dev Server' -ForegroundColor Cyan; Write-Host '  Running on $APP_URL' -ForegroundColor Green; Write-Host ''; npm run dev"
)

# Wait for Vite to finish initializing
Write-Info "Waiting for servers to be ready..."
Start-Sleep -Seconds 5

# Open browser
Write-Info "Opening $APP_NAME in your browser..."
Start-Process $APP_URL

Write-Host ""
Write-Host "  ╔══════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "  ║              SETUP COMPLETE!                     ║" -ForegroundColor Green
Write-Host "  ╚══════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "  Application URL : $APP_URL" -ForegroundColor White
Write-Host "  Backend API      : http://localhost:$BACKEND_PORT" -ForegroundColor White
Write-Host ""
Write-Host "  Two terminal windows are now running:" -ForegroundColor Gray
Write-Host "    - ACASTM Backend  (do not close)" -ForegroundColor Gray
Write-Host "    - ACASTM Frontend (do not close)" -ForegroundColor Gray
Write-Host ""
Write-Host "  For future runs, use: .\start.ps1" -ForegroundColor Yellow
Write-Host ""

Read-Host "  Press ENTER to close this setup window"
