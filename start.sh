#!/bin/bash

echo "Starting Barcode Inventory Management System..."
echo ""

echo "Step 1: Installing backend dependencies..."
cd backend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install backend dependencies"
    exit 1
fi

echo ""
echo "Step 2: Initializing database..."
npm run init-db
if [ $? -ne 0 ]; then
    echo "Failed to initialize database"
    exit 1
fi

echo ""
echo "Step 3: Installing frontend dependencies..."
cd ../frontend
npm install
if [ $? -ne 0 ]; then
    echo "Failed to install frontend dependencies"
    exit 1
fi

echo ""
echo "========================================"
echo "Installation completed successfully!"
echo "========================================"
echo ""
echo "To start the application:"
echo "1. Open a terminal and run: cd backend && npm run dev"
echo "2. Open another terminal and run: cd frontend && npm run dev"
echo "3. Open your browser and visit: http://localhost:4080"
echo ""
echo "Or use one-click start (recommended):"
echo "cd .. && npm run dev"
echo ""
echo "Default login credentials:"
echo "Username: admin"
echo "Password: admin123"
echo ""
