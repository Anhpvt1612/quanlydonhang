# Quick Deploy Script cho Windows

Write-Host "🚀 Deploy Ứng Dụng Quản Lý Đơn Hàng" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if git is installed
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Git chưa được cài đặt!" -ForegroundColor Red
    Write-Host "Vui lòng tải Git tại: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Git đã được cài đặt" -ForegroundColor Green
Write-Host ""

# Initialize git if not already
if (!(Test-Path ".git")) {
    Write-Host "📦 Khởi tạo Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✅ Đã khởi tạo Git" -ForegroundColor Green
    Write-Host ""
}

# Add .gitignore if not exists
if (!(Test-Path ".gitignore")) {
    Write-Host "⚠️ Tạo file .gitignore..." -ForegroundColor Yellow
    @"
node_modules
*.db
*.db-journal
.env
.DS_Store
.vercel
npm-debug.log
yarn-error.log
"@ | Out-File -FilePath ".gitignore" -Encoding UTF8
}

# Get GitHub username
Write-Host "📝 Nhập thông tin GitHub của bạn:" -ForegroundColor Cyan
$githubUsername = Read-Host "GitHub Username"

if ([string]::IsNullOrWhiteSpace($githubUsername)) {
    Write-Host "❌ Bạn phải nhập GitHub username!" -ForegroundColor Red
    exit 1
}

$repoName = "quanlydonhang"
$remoteUrl = "https://github.com/$githubUsername/$repoName.git"

Write-Host ""
Write-Host "📋 Thông tin repository:" -ForegroundColor Cyan
Write-Host "   Repository: $repoName" -ForegroundColor White
Write-Host "   URL: $remoteUrl" -ForegroundColor White
Write-Host ""

# Check if remote already exists
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "⚠️ Remote 'origin' đã tồn tại: $existingRemote" -ForegroundColor Yellow
    $updateRemote = Read-Host "Bạn có muốn cập nhật remote? (y/n)"
    if ($updateRemote -eq "y") {
        git remote set-url origin $remoteUrl
        Write-Host "✅ Đã cập nhật remote URL" -ForegroundColor Green
    }
} else {
    git remote add origin $remoteUrl
    Write-Host "✅ Đã thêm remote repository" -ForegroundColor Green
}

Write-Host ""
Write-Host "📦 Chuẩn bị commit code..." -ForegroundColor Yellow

# Add all files
git add .

# Commit
$commitMessage = "Deploy: PWA Order Management App"
git commit -m $commitMessage

Write-Host "✅ Đã commit code" -ForegroundColor Green
Write-Host ""

# Push to GitHub
Write-Host "⬆️  Đang push code lên GitHub..." -ForegroundColor Yellow
Write-Host "   (Bạn có thể cần nhập username/password hoặc token)" -ForegroundColor Gray

git branch -M main
$pushResult = git push -u origin main 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Đã push code lên GitHub thành công!" -ForegroundColor Green
} else {
    Write-Host "⚠️ Không thể push tự động. Lỗi:" -ForegroundColor Yellow
    Write-Host $pushResult -ForegroundColor Gray
    Write-Host ""
    Write-Host "💡 Có thể bạn cần:" -ForegroundColor Cyan
    Write-Host "   1. Tạo repository '$repoName' trên GitHub trước" -ForegroundColor White
    Write-Host "   2. Hoặc push thủ công bằng: git push -u origin main" -ForegroundColor White
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "🎉 TIẾP THEO:" -ForegroundColor Green
Write-Host ""
Write-Host "1️⃣  Truy cập: https://render.com" -ForegroundColor White
Write-Host "2️⃣  Tạo Web Service mới từ GitHub repo: $githubUsername/$repoName" -ForegroundColor White
Write-Host "3️⃣  Cấu hình:" -ForegroundColor White
Write-Host "     - Build Command: cd backend && npm install" -ForegroundColor Gray
Write-Host "     - Start Command: node backend/server.js" -ForegroundColor Gray
Write-Host "     - Add Disk: mount tại /opt/render/project/backend" -ForegroundColor Gray
Write-Host ""
Write-Host "4️⃣  Sau khi deploy xong, mở URL trên iPhone Safari" -ForegroundColor White
Write-Host "5️⃣  Nhấn Share → Add to Home Screen" -ForegroundColor White
Write-Host ""
Write-Host "📖 Chi tiết: Xem file DEPLOY.md" -ForegroundColor Cyan
Write-Host ""
Write-Host "✨ Chúc bạn deploy thành công!" -ForegroundColor Green
