#!/bin/bash

# Ensure the script is run as root
if [ "$EUID" -ne 0 ]; then 
  echo "Please run as root (sudo ./fix_nginx.sh)"
  exit 1
fi

echo "Creating backups..."
cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak.$(date +%s)
cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.bak.$(date +%s)

echo "Fixing nginx.conf..."
# Remove the incorrect location /uploads block from nginx.conf if present
# This deletes lines starting from 'location /uploads {' to the next '}'
sed -i '/location \/uploads {/,/}/d' /etc/nginx/nginx.conf

# Ensure client_max_body_size is set in http block
if ! grep -q "client_max_body_size" /etc/nginx/nginx.conf; then
    # Insert after 'http {'
    sed -i '/http {/a \ \ \ \ client_max_body_size 1024M;' /etc/nginx/nginx.conf
else
    # Update existing value if present but not 1024M
    sed -i 's/client_max_body_size .*/client_max_body_size 1024M;/g' /etc/nginx/nginx.conf
fi

echo "Fixing sites-available/default..."
# Check if location /uploads is already there
if ! grep -q "location /uploads" /etc/nginx/sites-available/default; then
    # Attempt to insert before the last closing brace '}' of the file
    # We use a trick to replace the last occurrence of '}' with our block + '}'
    # Note: This assumes the file ends with the server block closing brace.
    
    # Read the file content
    CONTENT=$(cat /etc/nginx/sites-available/default)
    
    # Construct the new block
    NEW_BLOCK='
    location /uploads {
        proxy_pass http://localhost:3001;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}'
    
    # Use sed to replace the last line if it contains '}'
    # This is a bit brittle, so we'll try a safer insertion point if possible.
    # Safest is to append inside server block.
    # Let's try to match the end of the file.
    
    sed -i '$s/}/location \/uploads {\n        proxy_pass http:\/\/localhost:3001;\n        expires 30d;\n        add_header Cache-Control "public, no-transform";\n    }\n}/' /etc/nginx/sites-available/default
else
    echo "location /uploads already exists in sites-available/default"
fi

echo "Testing configuration..."
nginx -t

if [ $? -eq 0 ]; then
    echo "Configuration looks good. Reloading Nginx..."
    systemctl reload nginx
    echo "SUCCESS: Nginx configuration fixed and reloaded."
else
    echo "ERROR: Nginx configuration test failed."
    echo "Restoring backups..."
    cp /etc/nginx/nginx.conf.bak.* /etc/nginx/nginx.conf
    cp /etc/nginx/sites-available/default.bak.* /etc/nginx/sites-available/default
    echo "Backups restored. Please check errors manually."
    exit 1
fi
