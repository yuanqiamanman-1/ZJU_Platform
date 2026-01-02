const fs = require('fs');
const { execSync } = require('child_process');

const CONFIG_FILE = '/etc/nginx/sites-available/default';
const BACKUP_FILE = `/etc/nginx/sites-available/default.bak.${Date.now()}`;

console.log("========================================");
console.log("   Nginx Configuration Smart Fixer");
console.log("========================================");

// 1. Check Permissions
if (process.getuid && process.getuid() !== 0) {
    console.error("ERROR: This script must be run as root (sudo).");
    process.exit(1);
}

// 2. Backup
try {
    if (fs.existsSync(CONFIG_FILE)) {
        console.log(`[+] Backing up config to ${BACKUP_FILE}...`);
        fs.copyFileSync(CONFIG_FILE, BACKUP_FILE);
    } else {
        console.error(`ERROR: Config file not found at ${CONFIG_FILE}`);
        process.exit(1);
    }
} catch (e) {
    console.error("ERROR creating backup:", e.message);
    process.exit(1);
}

// 3. Read Config
let content = fs.readFileSync(CONFIG_FILE, 'utf8');
console.log("[+] Config file read successfully.");

// 4. Clean existing /uploads blocks (regex to match multiline location blocks)
// Matches "location ... /uploads ... { ... }" handling nested braces is hard in regex, 
// but standard nginx blocks are usually simple.
// We'll remove lines that look like our previous attempts to avoid clutter.
console.log("[+] Cleaning old upload blocks...");
const lines = content.split('\n');
const newLines = [];
let skipping = false;
let openBraces = 0;

for (const line of lines) {
    // Detect start of an uploads block
    if (line.trim().match(/^location\s+[\^~]*\s*\/uploads/)) {
        skipping = true;
        openBraces = 0;
        // Count braces in this line
        openBraces += (line.match(/\{/g) || []).length;
        openBraces -= (line.match(/\}/g) || []).length;
        if (openBraces === 0) skipping = false; // One-liner case
        continue;
    }

    if (skipping) {
        openBraces += (line.match(/\{/g) || []).length;
        openBraces -= (line.match(/\}/g) || []).length;
        if (openBraces <= 0) {
            skipping = false;
        }
        continue;
    }

    newLines.push(line);
}

content = newLines.join('\n');

// 5. Insert New Block
// We want to insert it INSIDE the server block, preferably near the end but before the closing brace.
// Strategy: Find the last '}' and insert before it. 
// Note: This assumes the file ends with the server block's closing brace.
// If there are multiple server blocks, this might be tricky, but usually 'default' has just one.

const proxyBlock = `
    # Proxy uploads to Node.js backend (Added by Smart Fixer)
    location ^~ /uploads {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
`;

// Find the last closing brace
const lastBraceIndex = content.lastIndexOf('}');
if (lastBraceIndex === -1) {
    console.error("ERROR: Could not find closing brace '}' in config file.");
    process.exit(1);
}

// Insert before the last brace
const newContent = content.slice(0, lastBraceIndex) + proxyBlock + content.slice(lastBraceIndex);

// 6. Write Back
try {
    fs.writeFileSync(CONFIG_FILE, newContent, 'utf8');
    console.log("[+] Configuration updated.");
} catch (e) {
    console.error("ERROR writing config:", e.message);
    process.exit(1);
}

// 7. Test and Reload
console.log("[+] Testing Nginx configuration...");
try {
    execSync('nginx -t', { stdio: 'inherit' });
    console.log("[+] Syntax OK. Reloading Nginx...");
    execSync('systemctl reload nginx', { stdio: 'inherit' });
    console.log("SUCCESS: Nginx reloaded successfully!");
} catch (e) {
    console.error("ERROR: Nginx test failed or reload failed.");
    console.log("Restoring backup...");
    fs.copyFileSync(BACKUP_FILE, CONFIG_FILE);
    console.log("Backup restored.");
    process.exit(1);
}
