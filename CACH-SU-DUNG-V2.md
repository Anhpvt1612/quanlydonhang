# 🚀 HƯỚNG DẪN CHẠY QUANLÝDONHANG PRO V2.0

## 📋 YÊU CẦU HỆ THỐNG
- Node.js 20.x (LTS)
- npm hoặc yarn
- Git
- Trình duyệt hiện đại (Chrome, Safari, Firefox)

---

## ⚡ CHẠY LOCAL (Máy tính của bạn)

### Bước 1: Cài đặt dependencies
```bash
cd backend
npm install
```

### Bước 2: Khởi động server
```bash
npm start
```

Hoặc dùng nodemon (auto-reload khi sửa code):
```bash
npm run dev
```

### Bước 3: Mở trình duyệt
Truy cập: **http://localhost:3000**

---

## 🎯 CÁCH SỬ DỤNG APP

### 1. Đăng ký tài khoản mới
- Click tab "Đăng ký"
- Nhập thông tin:
  - Username (tên đăng nhập)
  - Password (mật khẩu)
  - Full Name (tên đầy đủ của bạn)
- Click "Đăng ký"

### 2. Đăng nhập
- Click tab "Đăng nhập"
- Nhập username và password
- Click "Đăng nhập"

### 3. Thêm đơn hàng
**Cách 1**: Click nút "+" (FAB) ở góc dưới bên phải

**Cách 2**: Vào menu "Đơn hàng" → Click "Thêm đơn hàng"

Nhập thông tin:
- **Mã đơn hàng**: Copy/paste từ hệ thống (VD: DH12345)
- **Số tiền**: Giá trị đơn hàng
- **Trạng thái thanh toán**: Đã thanh toán / Chưa thanh toán
- **Phương thức thanh toán**: Chuyển khoản / Tiền mặt / Trả sau
- **Ngày giao hàng**: Chọn ngày
- **Ghi chú**: Ghi chú bổ sung (tùy chọn)

### 4. Tìm kiếm & Lọc đơn hàng
- **Tìm kiếm**: Nhập mã đơn hoặc ghi chú → Tự động lọcfilter
- **Lọc theo trạng thái**: Chọn "Đã thanh toán" hoặc "Chưa thanh toán"
- **Lọc theo ngày**: Chọn từ ngày → đến ngày
- **Sắp xếp**: Theo ngày tạo, số tiền, mã đơn (tăng/giảm dần)
- **Xóa bộ lọc**: Click "Xóa bộ lọc"

### 5. Sửa/Xóa đơn hàng
- **Sửa**: Click icon ✏️ (bút chì) → Sửa thông tin → "Lưu"
- **Xóa**: Click icon 🗑️ (thùng rác) → Xác nhận xóa

### 6. Xóa nhiều đơn cùng lúc
- Tick chọn các đơn hàng cần xóa
- Thanh màu vàng hiện lên → Click "Xóa đã chọn"
- Xác nhận xóa

### 7. Xuất dữ liệu (Export)
- Vào menu "Đơn hàng"
- Click "Export"
- Chọn định dạng:
  - **Excel (.xlsx)**: Dùng cho Excel/Google Sheets
  - **CSV (.csv)**: Dùng cho Excel/Numbers
  - **JSON (.json)**: Dùng cho lập trình viên

### 8. Xem thống kê
- Vào menu "Dashboard" để xem:
  - Tổng số đơn hàng
  - Tổng tiền đã thanh toán
  - Tổng tiền chưa thanh toán
  - Số đơn hôm nay

### 9. Đăng xuất
- Click avatar (chữ cái đầu tên bạn) ở góc trên phải
- Click "Đăng xuất"

---

## 📱 CÀI ĐẶT VÀO IPHONE (PWA)

### Sau khi deploy lên Render.com:

1. Mở Safari trên iPhone
2. Truy cập URL của bạn (VD: https://quanlydonhang-xyz.onrender.com)
3. Click nút **Share** (icon mũi tên hướng lên) ở dưới màn hình
4. Kéo xuống → Chọn **"Add to Home Screen"**
5. Đặt tên: "Quản Lý Đơn" → Click **Add**
6. Icon app xuất hiện ở màn hình chính

**Lúc sau**: Mở app như ứng dụng bình thường!

---

## 🌍 DEPLOY LÊN RENDER.COM

### Bước 1: Push code lên GitHub
```bash
# Quay về thư mục gốc
cd ..

# Add tất cả file mới
git add .

# Commit với message
git commit -m "Upgrade to v2.0: Professional UI with Authentication"

# Push lên GitHub
git push origin main
```

### Bước 2: Redeploy trên Render
- Vào https://dashboard.render.com
- Tìm service "quanlydonhang"
- Render sẽ **TỰ ĐỘNG PHÁT HIỆN** code mới và redeploy
- Chờ 3-5 phút

### Bước 3: Kiểm tra
- Truy cập URL của bạn
- Đăng ký tài khoản mới
- Test các tính năng

---

## 🐛 XỬ LÝ LỖI THƯỜNG GẶP

### Lỗi: "Cannot find module 'bcrypt'"
```bash
cd backend
npm install
```

### Lỗi: "Port 3000 is already in use"
**Windows**:
```powershell
# Tìm process đang dùng port 3000
netstat -ano | findstr :3000

# Xem PID (số cuối cùng), ví dụ: 12345
taskkill /PID 12345 /F
```

**Mac/Linux**:
```bash
lsof -ti:3000 | xargs kill -9
```

### Lỗi: "Failed to login"
- Kiểm tra username/password
- Nếu mới đăng ký, đợi vài giây rồi thử lại

### App không hiển thị đúng
- Hard refresh: `Ctrl + Shift + R` (Windows) hoặc `Cmd + Shift + R` (Mac)
- Xóa cache trình duyệt

---

## 🔒 BẢO MẬT

### QUAN TRỌNG khi deploy production:

1. **Đổi JWT Secret** trong `backend/server-v2.js`:
```javascript
// Tìm dòng này (line ~15):
const JWT_SECRET = 'your-very-secret-jwt-key-change-in-production';

// Đổi thành random string dài:
const JWT_SECRET = 'abc123xyz789yourverylongrandomstring!@#';
```

2. **Không share token** với người khác

3. **Backup định kỳ**:
- Export dữ liệu ra Excel/JSON hàng tuần
- Lưu file vào Google Drive / Dropbox

---

## 📊 TÍNH NĂNG ĐÃ CÓ

✅ **Authentication & Multi-User**
- Đăng ký/Đăng nhập với JWT
- Mỗi user riêng dữ liệu
- Session 7 ngày

✅ **Quản Lý Đơn Hàng**
- Thêm/Sửa/Xóa đơn
- Lưu mã đơn, số tiền, trạng thái, phương thức
- Lưu ngày giao hàng
- Thêm ghi chú đơn hàng

✅ **Tìm Kiếm & Lọc**
- Tìm theo mã đơn, ghi chú
- Lọc theo trạng thái thanh toán
- Lọc theo khoảng ngày
- Sắp xếp đa dạng

✅ **Bulk Operations**
- Chọn nhiều đơn
- Xóa nhiều đơn cùng lúc

✅ **Export Data**
- Xuất Excel (.xlsx)
- Xuất CSV (.csv)
- Xuất JSON (.json)

✅ **Dashboard & Stats**
- Tổng quan đơn hàng
- Thống kê theo ngày
- Thống kê tiền

✅ **Professional UI**
- Giao diện hiện đại, không emoji
- Lucide Icons
- Dark mode tự động
- Responsive (mobile-first)
- Smooth animations

✅ **PWA Features**
- Cài đặt vào Home Screen
- Offline support
- App-like experience

✅ **Security**
- Password hashing (bcrypt)
- JWT authentication
- CORS protection
- Activity logging

---

## 🚧 TÍNH NĂNG SẼ CÓ (Future)

⏳ **Calendar View**
- Xem đơn hàng theo lịch
- Click ngày để xem chi tiết

⏳ **Analytics Dashboard**
- Biểu đồ doanh thu
- Thống kê theo tuần/tháng
- Xu hướng đơn hàng

⏳ **Advanced Features**
- In đơn hàng
- Gửi email thông báo
- Nhắc nhở thanh toán
- Backup tự động

---

## 💡 TIPS & TRICKS

### Copy/Paste nhanh mã đơn hàng
1. Copy mã đơn từ hệ thống (VD: DH00123)
2. Click nút "+" để mở form
3. Paste vào ô "Mã đơn hàng"
4. Tab để nhảy sang ô tiếp theo
5. Nhập số tiền → Enter để lưu

### Tìm đơn hàng nhanh bằng 5 số cuối
- Gõ 5 số cuối mã đơn vào ô tìm kiếm
- VD: mã đơn "DH00123" → Gõ "00123"

### Xem đơn chưa thanh toán
- Lọc trạng thái: "Chưa thanh toán"
- Sắp xếp: "Số tiền - Giảm dần"
→ Ưu tiên thu tiền đơn lớn

---

## 🆘 HỖ TRỢ

**Gặp vấn đề?**
- Kiểm tra console: F12 → Console tab
- Xem error message màu đỏ
- Screenshot gửi để được hỗ trợ

**Cần thêm tính năng?**
- Cho tôi biết bạn cần gì
- Tôi sẽ code thêm cho bạn!

---

## 📝 CHANGELOG

### Version 2.0.0 (Current)
- ✨ Thêm Authentication & Multi-user
- ✨ Professional UI với Lucide Icons
- ✨ Quản lý theo ngày
- ✨ Export dữ liệu (Excel/CSV/JSON)
- ✨ Bulk operations
- ✨ Advanced filtering & sorting
- ✨ Dashboard với stats
- ✨ Activity logging
- 🐛 Fix responsive issues
- 🎨 Modern design system

### Version 1.0.0
- ✅ Basic CRUD operations
- ✅ PWA support
- ✅ Render.com deployment
- ✅ Simple search

---

## 🎉 HOÀN TẤT!

App của bạn đã sẵn sàng! Chúc bạn quản lý đơn hàng hiệu quả! 🚀📦
