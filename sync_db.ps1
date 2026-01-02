$ErrorActionPreference = "Stop"

$ServerIP = "118.31.78.72"
$User = "root"
$RemotePath = "/root/ZJU_Platform/server/database.sqlite"
$LocalPath = "server\database.sqlite"

Write-Host "正在将数据库同步到服务器 $ServerIP..." -ForegroundColor Cyan

# Check if scp is available
if (-not (Get-Command scp -ErrorAction SilentlyContinue)) {
    Write-Error "未找到 scp 命令。请确保安装了 OpenSSH 客户端 (Windows 设置 -> 应用 -> 可选功能)。"
}

# Upload
Write-Host "1. 正在停止远程服务并清理临时文件..."
ssh ${User}@${ServerIP} "pm2 stop all; rm -f /root/ZJU_Platform/server/database.sqlite-wal /root/ZJU_Platform/server/database.sqlite-shm"

Write-Host "2. 正在上传数据库文件..."
scp $LocalPath ${User}@${ServerIP}:${RemotePath}

if ($LASTEXITCODE -eq 0) {
    Write-Host "3. 正在重启远程服务..."
    ssh ${User}@${ServerIP} "cd /root/ZJU_Platform/server && pm2 restart all"
    
    Write-Host "数据库同步成功！" -ForegroundColor Green
} else {
    Write-Error "数据库同步失败。"
}
