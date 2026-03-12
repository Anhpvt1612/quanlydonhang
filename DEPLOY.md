# 🚀 Hướng Dẫn Deploy Ứng Dụng Lên Server Online

Để cài đặt PWA trên iPhone từ bất kỳ đâu, bạn cần deploy ứng dụng lên một server online có HTTPS.

---

## 🎯 Lựa Chọn Platform (Miễn Phí)

### Tôi khuyên dùng: **Render.com** ⭐ (Tốt nhất cho SQLite)

**Ưu điểm:**
- ✅ Miễn phí
- ✅ Hỗ trợ persistent storage (SQLite database không bị mất)
- ✅ Tự động HTTPS
- ✅ Deploy từ GitHub dễ dàng

**Nhược điểm:**
- ⏰ Free tier sleep sau 15 phút không dùng (trang đầu tiên load chậm)

---

## 📦 Cách 1: Deploy với Render.com (Khuyên Dùng)

### Bước 1: Chuẩn Bị

1. Tạo tài khoản miễn phí tại: https://render.com

2. Tạo repository GitHub:
   - Vào https://github.com và tạo repo mới
   - Tên: `quanlydonhang`
   - Set là **Public** hoặc **Private** (cả 2 đều OK)

### Bước 2: Push Code Lên GitHub

Mở terminal trong thư mục dự án và chạy:

```bash
# Khởi tạo git (nếu chưa có)
git init

# Add tất cả files
git add .

# Commit
git commit -m "Initial commit - PWA order management app"

# Add remote repository (thay YOUR_USERNAME bằng username GitHub của bạn)
git remote add origin https://github.com/YOUR_USERNAME/quanlydonhang.git

# Push lên GitHub
git branch -M main
git push -u origin main
```

### Bước 3: Deploy trên Render

1. Đăng nhập vào https://render.com

2. Click **"New +"** → Chọn **"Web Service"**

3. Kết nối GitHub repository `quanlydonhang`

4. Cấu hình như sau:
   - **Name**: `quanlydonhang` (hoặc tên bạn thích)
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `node backend/server.js`
   - **Instance Type**: `Free`

5. Trong phần **Advanced**:
   - Add Disk:
     - **Name**: `orders-data`
     - **Mount Path**: `/opt/render/project/backend`
     - **Size**: `1 GB`

6. Click **"Create Web Service"**

7. Chờ 3-5 phút để Render build và deploy

8. ✅ Xong! URL của bạn sẽ là: `https://quanlydonhang.onrender.com`

### Bước 4: Cài PWA trên iPhone

1. Mở **Safari** trên iPhone
2. Truy cập: `https://quanlydonhang.onrender.com`
3. Nhấn **Share** → **"Add to Home Screen"**
4. ✅ Xong! Giờ bạn có thể dùng app từ bất kỳ đâu!

---

## 🚄 Cách 2: Deploy với Railway.app (Nhanh nhất)

### Khuyên dùng nếu: Bạn muốn deploy cực nhanh trong 2 phút

**Ưu điểm:**
- ⚡ Deploy cực nhanh
- ✅ Không sleep (free tier tốt hơn)
- ✅ UI đẹp, dễ dùng

**Nhược điểm:**
- ⚠️ Free tier chỉ có $5 credit/tháng (hết là phải trả tiền)

### Các Bước:

1. Truy cập: https://railway.app

2. Đăng nhập bằng GitHub

3. Click **"New Project"** → **"Deploy from GitHub repo"**

4. Chọn repository `quanlydonhang`

5. Railway tự động detect và deploy

6. Sau khi deploy xong:
   - Vào **Settings** → **Generate Domain**
   - Copy URL (ví dụ: `quanlydonhang.up.railway.app`)

7. ✅ Xong! Truy cập URL và cài PWA

---

## ☁️ Cách 3: Deploy với Vercel (Đơn giản nhất)

### ⚠️ Lưu ý: Vercel là serverless, SQLite sẽ bị reset sau mỗi deployment

**Ưu điểm:**
- ⚡ Deploy cực nhanh
- ✅ Unlimited bandwidth
- ✅ Tự động deploy khi push code

**Nhược điểm:**
- ❌ Database SQLite sẽ bị xóa sau mỗi lần deploy
- ❌ Phải dùng cloud database (MongoDB, PostgreSQL) thay vì SQLite

### Các Bước:

1. Cài Vercel CLI:
```bash
npm install -g vercel
```

2. Trong thư mục dự án, chạy:
```bash
vercel login
vercel
```

3. Làm theo hướng dẫn:
   - Setup and deploy? `Y`
   - Scope: chọn account của bạn
   - Link to existing project? `N`
   - Project name: `quanlydonhang`
   - Directory: `./` (enter)
   - Override settings? `N`

4. ✅ Xong! Vercel sẽ cho bạn URL: `https://quanlydonhang.vercel.app`

### Để giữ database trên Vercel:

Bạn cần dùng cloud database:
- **MongoDB Atlas** (free): https://www.mongodb.com/atlas
- **Supabase PostgreSQL** (free): https://supabase.com
- **PlanetScale MySQL** (free): https://planetscale.com

---

## 🎯 So Sánh Nhanh

| Platform | Deploy Speed | Database | Free Tier | Khuyên Dùng |
|----------|-------------|----------|-----------|-------------|
| **Render** | ⭐⭐⭐ | ✅ SQLite OK | ✅ Unlimited | ⭐⭐⭐⭐⭐ |
| **Railway** | ⭐⭐⭐⭐⭐ | ✅ SQLite OK | ⚠️ $5/month | ⭐⭐⭐⭐ |
| **Vercel** | ⭐⭐⭐⭐⭐ | ❌ Cần cloud DB | ✅ Unlimited | ⭐⭐⭐ |

---

## 📱 Sau Khi Deploy

1. **Test trên máy tính**: Mở URL trong browser, test các chức năng

2. **Cài PWA trên iPhone**:
   - Mở Safari
   - Vào URL của bạn (ví dụ: `https://quanlydonhang.onrender.com`)
   - Nhấn Share → "Add to Home Screen"

3. **Chia sẻ với đồng nghiệp**: Gửi URL cho ai cũng cài được!

---

## 🔧 Troubleshooting

### App bị sleep trên Render?
- Render free tier sleep sau 15 phút không dùng
- Giải pháp: Dùng uptime monitoring (https://uptimerobot.com) để ping app 5 phút/lần

### Database bị mất data?
- Kiểm tra đã add **Persistent Disk** chưa
- Disk phải mount vào `/opt/render/project/backend` (nơi có file orders.db)

### Không connect được API?
- Kiểm tra logs trên platform dashboard
- Đảm bảo `package.json` đã được push lên GitHub
- Kiểm tra `start command` đúng chưa: `node backend/server.js`

---

## 🎉 Hoàn Thành!

Giờ bạn đã có:
- ✅ URL công khai với HTTPS
- ✅ PWA có thể cài trên bất kỳ iPhone/Android nào
- ✅ Không cần cùng WiFi
- ✅ Hoạt động từ bất kỳ đâu trên thế giới!

**Tôi khuyên dùng Render.com** vì nó miễn phí và giữ được SQLite database. Nếu muốn nhanh hơn thì dùng Railway.

---

**💡 Tip**: Sau khi deploy, có thể tắt máy tính local. App vẫn chạy 24/7 trên server!
