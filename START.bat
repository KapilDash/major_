@echo off
REM Startup script for Indian Judiciary AI System
REM Starts both backend (FastAPI) and frontend (React/Vite)

setlocal enabledelayedexpansion

echo.
echo ╔══════════════════════════════════════════════════════════════╗
echo ║                                                              ║
echo ║     🏛️  INDIAN JUDICIARY AI SYSTEM - STARTUP SCRIPT 🏛️      ║
echo ║                                                              ║
echo ╚══════════════════════════════════════════════════════════════╝
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ⚠️  WARNING: Script does not have administrator privileges
    echo    Some features may not work properly
    echo.
)

REM Configuration
set BACKEND_DIR=d:\Major_project\backend
set FRONTEND_DIR=d:\Major_project\frontend\LegalAi
set BACKEND_PORT=8000
set FRONTEND_PORT=5173

REM Check directories exist
if not exist "%BACKEND_DIR%" (
    echo ❌ ERROR: Backend directory not found: %BACKEND_DIR%
    pause
    exit /b 1
)

if not exist "%FRONTEND_DIR%" (
    echo ❌ ERROR: Frontend directory not found: %FRONTEND_DIR%
    pause
    exit /b 1
)

echo 📦 SYSTEM REQUIREMENTS CHECK:
echo.

REM Check Python
python --version >nul 2>&1
if %errorLevel% equ 0 (
    echo   ✅ Python installed: && python --version
) else (
    echo   ❌ Python not found in PATH
    echo.
    pause
    exit /b 1
)

REM Check Node.js
node --version >nul 2>&1
if %errorLevel% equ 0 (
    echo   ✅ Node.js installed: && node --version
) else (
    echo   ⚠️  Node.js not found (required for frontend)
)

REM Check npm
npm --version >nul 2>&1
if %errorLevel% equ 0 (
    echo   ✅ npm installed: && npm --version
) else (
    echo   ⚠️  npm not found (required for frontend)
)

echo.
echo ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
echo.

REM Ask user what to start
echo Select what to start:
echo.
echo   1) Backend only (FastAPI on port %BACKEND_PORT%)
echo   2) Frontend only (React on port %FRONTEND_PORT%)
echo   3) Both Backend and Frontend
echo   4) Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    call :start_backend
    goto end
) else if "%choice%"=="2" (
    call :start_frontend
    goto end
) else if "%choice%"=="3" (
    call :start_both
    goto end
) else (
    echo Exiting...
    exit /b 0
)

:start_backend
echo.
echo 🚀 Starting Backend Server...
echo.
cd /d "%BACKEND_DIR%"

REM Check if venv exists
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

REM Activate venv and start server
if exist "venv\Scripts\activate.bat" (
    call venv\Scripts\activate.bat
    echo ✅ Virtual environment activated
    echo.
    echo Starting FastAPI server...
    python run.py
) else (
    echo ❌ Failed to activate virtual environment
    pause
    exit /b 1
)
goto end

:start_frontend
echo.
echo 🚀 Starting Frontend Server...
echo.
cd /d "%FRONTEND_DIR%"

if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
)

echo Starting React development server...
call npm run dev

goto end

:start_both
echo.
echo 🚀 Starting Backend AND Frontend...
echo.

REM Start backend in new window
echo Starting Backend on port %BACKEND_PORT%...
start "Backend - FastAPI" cmd /k "cd /d %BACKEND_DIR% && venv\Scripts\activate.bat && python run.py"

REM Wait a bit for backend to start
timeout /t 3 /nobreak

REM Start frontend in new window
echo Starting Frontend on port %FRONTEND_PORT%...
start "Frontend - React" cmd /k "cd /d %FRONTEND_DIR% && npm run dev"

REM Wait for both to start
timeout /t 3 /nobreak

echo.
echo ✅ Both servers started!
echo.
echo 📍 URLS:
echo    Frontend:   http://localhost:%FRONTEND_PORT%
echo    Backend:    http://localhost:%BACKEND_PORT%
echo    API Docs:   http://localhost:%BACKEND_PORT%/docs
echo.
echo Press any key to continue...
pause

goto end

:end
echo.
echo 👋 Goodbye!
pause
exit /b 0
