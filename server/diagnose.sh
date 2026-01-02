#!/bin/bash

echo "========================================"
echo "       ZJU Platform Diagnosis Tool      "
echo "========================================"

echo "[1] Checking Nginx Status..."
systemctl is-active nginx
if [ $? -eq 0 ]; then
    echo "Nginx is RUNNING."
else
    echo "Nginx is NOT RUNNING."
fi

echo ""
echo "[2] Checking Backend Process (Port 3001)..."
if lsof -Pi :3001 -sTCP:LISTEN -t >/dev/null ; then
    echo "Port 3001 is OPEN (Backend is running)."
else
    echo "Port 3001 is CLOSED (Backend is NOT running!)."
fi

echo ""
echo "[3] Checking Uploads Directory..."
UPLOAD_DIR="$(pwd)/uploads"
if [ -d "$UPLOAD_DIR" ]; then
    echo "Uploads directory exists at: $UPLOAD_DIR"
    FILE_COUNT=$(ls -1 "$UPLOAD_DIR" | wc -l)
    echo "File count: $FILE_COUNT"
    ls -lt "$UPLOAD_DIR" | head -n 5
else
    echo "ERROR: Uploads directory NOT found at $UPLOAD_DIR"
fi

echo ""
echo "[4] Checking Nginx Configuration..."
echo "Checking sites-available/default for /uploads location block:"
if grep -q "location /uploads" /etc/nginx/sites-available/default; then
    echo "SUCCESS: 'location /uploads' found in config."
    grep -A 5 "location /uploads" /etc/nginx/sites-available/default
else
    echo "FAILURE: 'location /uploads' NOT found in /etc/nginx/sites-available/default"
fi

echo ""
echo "[5] Connectivity Test..."
# Find a test file
TEST_FILE=$(ls "$UPLOAD_DIR" | head -n 1)
if [ ! -z "$TEST_FILE" ]; then
    echo "Testing access to file: $TEST_FILE"
    
    echo "--- Test 1: Direct Backend Access (localhost:3001) ---"
    HTTP_CODE=$(curl -o /dev/null -s -w "%{http_code}\n" http://localhost:3001/uploads/$TEST_FILE)
    echo "Response Code: $HTTP_CODE"
    if [ "$HTTP_CODE" == "200" ]; then
        echo "Backend serving file: OK"
    else
        echo "Backend serving file: FAILED"
    fi

    echo "--- Test 2: Nginx Proxy Access (localhost:80) ---"
    HTTP_CODE_NGINX=$(curl -o /dev/null -s -w "%{http_code}\n" http://localhost/uploads/$TEST_FILE)
    echo "Response Code: $HTTP_CODE_NGINX"
    if [ "$HTTP_CODE_NGINX" == "200" ]; then
        echo "Nginx proxying file: OK"
    else
        echo "Nginx proxying file: FAILED (Check Nginx logs)"
    fi
else
    echo "No files to test in uploads directory."
fi

echo ""
echo "========================================"
echo "Diagnosis Complete."
