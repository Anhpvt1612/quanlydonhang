# 🔄 CÁCH XEM GIAO DIỆN MỚI V2

## Vấn đề: Browser đang cache HTML/CSS/JS cũ

### ✅ GIẢI PHÁP NHANH:

#### **HARD REFRESH** (Bắt buộc!)

**Windows (Chrome/Edge/Firefox):**
```
Ctrl + Shift + R
```
Hoặc:
```
Ctrl + F5
```

**Mac:**
```
Cmd + Shift + R
```

---

## 🧹 NẾU VẪN KHÔNG ĐƯỢC:

### Bước 1: Clear Cache Hoàn Toàn

**Chrome/Edge:**
1. Nhấn `F12` mở DevTools
2. Click **chuột phải** vào nút Reload (⟳) ở thanh địa chỉ
3. Chọn **"Empty Cache and Hard Reload"**

**Firefox:**
1. Nhấn `Ctrl + Shift + Delete`
2. Chọn "Cached Web Content"
3. Click "Clear Now"
4. Reload: `Ctrl + Shift + R`

### Bước 2: Xác Nhận Files Đúng

Kiểm tra trong DevTools:
1. Nhấn `F12`
2. Vào tab **Network**
3. Reload trang (`F5`)
4. Tìm các file:
   - ✅ `index.html` (18KB - v2)
   - ✅ `styles-v2.css` (28KB)
   - ✅ `app-v2.js` (26KB)

---

## 🎨 BẠN SẼ THẤY:

### Giao Diện V2 (Mới):
✅ **Màn hình đăng nhập/đăng ký** (2 tabs)
✅ **Form đẹp** với border tròn
✅ **Icons chuyên nghiệp** (không emoji)
✅ **Nút "Đăng Nhập"** màu xanh to
✅ **Background gradient** màu xanh

### Giao Diện V1 (Cũ):
❌ Có emoji 😀 📦 💰
❌ Không có đăng nhập
❌ Giao diện đơn giản
❌ Danh sách đơn hàng ngay từ đầu

---

## 📸 SCREENSHOT ĐỂ SO SÁNH:

### V1 (Cũ):
```
📦 Quản Lý Đơn Hàng
[Search box with emoji]
😀 Emoji buttons
Simple list view
```

### V2 (Mới):
```
🔒 QuanLyDonHang Pro
   Hệ thống quản lý đơn hàng chuyên nghiệp
   
   [Đăng Nhập] [Đăng Ký]
   
   Username: [_____________]
   Password: [_____________]
   
   [     ĐĂNG NHẬP     ]
```

---

## 🐛 TROUBLESHOOTING

### Nếu vẫn thấy V1:

1. **Check URL**: Đảm bảo đúng `http://localhost:3000`

2. **Kill tất cả Node processes**:
```powershell
Get-Process node | Stop-Process -Force
```

3. **Restart server**:
```powershell
cd d:\ViettelPost\quanlydonhang\backend
npm start
```

4. **Thử port khác**: Mở `http://localhost:3000` ở **Incognito/Private Window**

5. **Check file thực tế**:
```powershell
cd d:\ViettelPost\quanlydonhang\fronend
Get-Content index.html -First 30
```
Phải thấy: `QuanLyDonHang Pro` và `auth-screen`

---

## ✅ XÁC NHẬN THÀNH CÔNG

Khi thấy V2 đúng, bạn sẽ thấy:
- ✅ Màn hình đăng nhập đẹp
- ✅ Tab "Đăng Nhập" và "Đăng Ký"
- ✅ Icons (không emoji)
- ✅ Background gradient xanh

---

## 🚀 SAU ĐÓ:

1. **Đăng ký tài khoản**:
   - Username: `admin`
   - Password: `123456`
   - Full Name: `Admin`

2. **Đăng nhập** và test app!

---

Bạn thấy gì hiện tại? Screenshot giúp tôi nếu có thể! 📸
