@echo off
echo Starting Barcode Inventory Management System...
echo.

echo Step 1: Installing backend dependencies...
cd backend
call npm install
if errorlevel 1 (
    echo Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo Step 2: Initializing database...
call npm run init-db
if errorlevel 1 (
    echo Failed to initialize database
    pause
    exit /b 1
)

echo.
echo Step 3: Installing frontend dependencies...
cd ..\frontend
call npm install
if errorlevel 1 (
    echo Failed to install frontend dependencies
    pause
    exit /b 1
)

echo.
echo ========================================
echo Installation completed successfully!
echo ========================================
echo.
echo To start the application:
echo 1. Open a terminal and run: cd backend && npm run dev
echo 2. Open another terminal and run: cd frontend && npm run dev
echo 3. Open your browser and visit: http://localhost:3000
echo.
echo Default login credentials:
echo Username: admin
echo Password: admin123
echo.
pause
