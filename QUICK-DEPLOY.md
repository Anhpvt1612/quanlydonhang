# 🚀 QUICK START - Deploy Ứng Dụng Lên Server

## Để cài PWA trên iPhone từ xa, bạn cần deploy ứng dụng lên server online

---

## ⚡ CÁCH NHANH NHẤT (5-10 phút)

### 1. Tạo tài khoản GitHub
- Truy cập: https://github.com/signup
- Tạo tài khoản miễn phí

### 2. Tạo Repository mới
- Vào: https://github.com/new
- Tên: `quanlydonhang`
- Chọn: **Public**
- Bỏ qua các option khác
- Click: **Create repository**

### 3. Push code lên GitHub

**Option A: Dùng script tự động** (Khuyên dùng)
```powershell
.\deploy.ps1
```

**Option B: Thủ công**
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/quanlydonhang.git
git push -u origin main
```

### 4. Deploy trên Render.com

1. Tạo tài khoản: https://render.com (đăng nhập bằng GitHub)

2. Click **"New +"** → **"Web Service"**

3. Chọn repository `quanlydonhang`

4. Điền thông tin:
   ```
   Name: quanlydonhang
   Environment: Node
   Build Command: cd backend && npm install
   Start Command: node backend/server.js
   Instance Type: Free
   ```

5. **QUAN TRỌNG**: Thêm Persistent Disk
   - Scroll xuống **"Advanced"**
   - Click **"Add Disk"**
   - Name: `orders-data`
   - Mount Path: `/opt/render/project/backend`
   - Size: `1 GB`

6. Click **"Create Web Service"**

7. Chờ 3-5 phút... ☕

8. ✅ XONG! Copy URL (ví dụ: `https://quanlydonhang.onrender.com`)

### 5. Cài PWA trên iPhone

1. Mở **Safari** trên iPhone
2. Vào URL vừa copy (ví dụ: `https://quanlydonhang.onrender.com`)
3. Nhấn **Share** ⬆️ → **"Add to Home Screen"**
4. Nhấn **"Add"**
5. 🎉 XONG! Icon sẽ xuất hiện trên màn hình chính

---

## 🎯 Alternatives

### Railway (Nhanh hơn nhưng có giới hạn credit)
1. Vào: https://railway.app
2. Login bằng GitHub
3. New Project → Deploy from GitHub
4. Chọn repo → Auto deploy
5. Generate Domain → Copy URL
6. ✅ Xong!

### Fly.io (Tech-savvy)
```bash
npm install -g flyctl
fly launch
fly deploy
```

---

## 📖 Chi Tiết Hơn

Xem file **[DEPLOY.md](DEPLOY.md)** để có hướng dẫn chi tiết hơn.

---

## ❓ Troubleshooting

**"Git không được nhận dạng"**
→ Cài Git: https://git-scm.com/download/win

**"Permission denied"**
→ Cần setup SSH key hoặc dùng Personal Access Token

**"Database bị reset"**
→ Đảm bảo đã add **Persistent Disk** trên Render

**"App bị sleep"**
→ Render free tier sleep sau 15 phút. Dùng UptimeRobot để ping.

---

## ✨ Sau Khi Deploy

- ✅ App chạy 24/7 trên cloud
- ✅ Có thể tắt máy tính
- ✅ Dùng từ bất kỳ đâu
- ✅ Chia sẻ URL cho đồng nghiệp
- ✅ HTTPS tự động (cần cho PWA)

**Giờ bạn có một ứng dụng thật sự! 🎉**
