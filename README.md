# 📦 Ứng Dụng Quản Lý Đơn Hàng - Shipper

Ứng dụng web responsive dành cho shipper để quản lý đơn hàng giao dịch, theo dõi thanh toán và tìm kiếm đơn hàng dễ dàng.

## ✨ Tính Năng

### 1. Thêm Đơn Hàng

- Copy/paste mã đơn hàng
- Nhập số tiền đơn hàng
- Chọn trạng thái thanh toán:
  - ✅ **Đã thanh toán**: Chọn phương thức (chuyển khoản/tiền mặt)
  - ⏳ **Chưa thanh toán**: Thanh toán sau bằng chuyển khoản

### 2. Xem Danh Sách Đơn Hàng

- Hiển thị tất cả đơn hàng
- Thông tin chi tiết: mã đơn, số tiền, trạng thái, phương thức thanh toán
- Cập nhật trạng thái thanh toán
- Xóa đơn hàng

### 3. Tìm Kiếm

- Tìm theo mã đơn hàng (hỗ trợ 5 số cuối)
- Tìm theo số tiền chính xác
- Tìm theo khoảng tiền (từ...đến...)

### 4. Thống Kê

- Tổng số đơn hàng
- Tổng tiền đã thanh toán
- Tổng tiền chưa thanh toán

## 🚀 Cài Đặt và Chạy

### Yêu Cầu

- Node.js (phiên bản 14 trở lên)
- npm hoặc yarn

### Bước 1: Cài Đặt Dependencies

```bash
# Di chuyển vào thư mục backend
cd backend

# Cài đặt các package cần thiết
npm install
```

### Bước 2: Chạy Server

```bash
# Chạy server (production)
npm start

# Hoặc chạy với nodemon (development - tự động restart khi có thay đổi)
npm run dev
```

Server sẽ chạy tại: **http://localhost:3000**

### Bước 3: Truy Cập Ứng Dụng

Mở trình duyệt và truy cập:

```
http://localhost:3000
```

## 📱 Cài Đặt Ứng Dụng trên Điện Thoại (PWA)

Ứng dụng này là **Progressive Web App (PWA)** - bạn có thể cài đặt trực tiếp lên điện thoại như một ứng dụng thật!

### Cài Đặt trên iPhone/iPad (iOS)

1. Mở **Safari** và truy cập `http://[IP-của-máy-tính]:3000`
   - Ví dụ: `http://192.168.1.100:3000`
   - Để tìm IP máy tính: chạy lệnh `ipconfig` trên Windows
   
2. Nhấn nút **Chia sẻ** (Share) ⬆️ ở thanh dưới cùng

3. Cuộn xuống và chọn **"Add to Home Screen"** (Thêm vào Màn hình chính)

4. Đặt tên cho ứng dụng (ví dụ: "Quản Lý Đơn")

5. Nhấn **"Add"** để hoàn tất

6. ✅ Xong! Bây giờ bạn có thể mở ứng dụng từ màn hình chính như một app thật!

### Cài Đặt trên Android

1. Mở **Chrome** và truy cập `http://[IP-của-máy-tính]:3000`

2. Nhấn nút **"Cài Đặt Ứng Dụng"** xuất hiện ở dưới màn hình
   - Hoặc nhấn **menu (⋮)** → **"Add to Home screen"**

3. Xác nhận cài đặt

4. ✅ Ứng dụng sẽ xuất hiện trên màn hình chính!

### Lợi Ích của PWA

- ✅ **Chạy offline**: Các dữ liệu đã tải sẽ được cache
- ✅ **Như app thật**: Không có thanh địa chỉ, chạy toàn màn hình
- ✅ **Nhanh hơn**: Tải trang nhanh nhờ cache
- ✅ **Icon riêng**: Có icon đẹp trên màn hình chính
- ✅ **Không cần App Store**: Cài đặt trực tiếp từ web

### Lưu ý về Mạng

**Sử dụng local (cùng WiFi):**
- Máy tính và điện thoại phải cùng mạng WiFi
- Tìm IP máy tính: chạy `ipconfig` trên Windows
- Truy cập từ iPhone: `http://[IP]:3000`

**Hoặc Deploy lên Server Online (Khuyên dùng):**
- ✅ Sử dụng từ bất kỳ đâu, không cần cùng WiFi
- ✅ URL công khai với HTTPS (cần cho PWA trên iOS)
- ✅ Hoạt động 24/7, không cần mở máy tính

**👉 [Xem hướng dẫn deploy chi tiết tại DEPLOY.md](DEPLOY.md)**

**Deploy nhanh:** Chạy lệnh `.\deploy.ps1` trong thư mục dự án

## 📱 Sử Dụng

### Thêm Đơn Hàng Mới

1. Chọn tab **"➕ Thêm Đơn"**
2. Paste mã đơn hàng vào ô **"Mã Đơn Hàng"**
3. Nhập số tiền vào ô **"Số Tiền"**
4. Chọn trạng thái thanh toán:
   - Nếu chọn **"Đã Thanh Toán"**: Chọn phương thức (Chuyển khoản/Tiền mặt)
   - Nếu chọn **"Chưa Thanh Toán"**: Hệ thống tự động đánh dấu là thanh toán sau
5. Nhấn **"💾 Lưu Đơn Hàng"**

### Xem Danh Sách

1. Chọn tab **"📋 Danh Sách"**
2. Xem tất cả đơn hàng đã lưu
3. Có thể:
   - **Cập nhật**: Thay đổi trạng thái thanh toán
   - **Xóa**: Xóa đơn hàng khỏi hệ thống

### Tìm Kiếm Đơn Hàng

1. Chọn tab **"🔍 Tìm Kiếm"**
2. Nhập thông tin tìm kiếm:
   - **Mã đơn**: Nhập toàn bộ hoặc 5 số cuối
   - **Số tiền**: Nhập số tiền chính xác
   - **Khoảng tiền**: Nhập khoảng từ...đến...
3. Nhấn **"🔍 Tìm Kiếm"**
4. Nhấn **"❌ Xóa Bộ Lọc"** để reset tìm kiếm

## 🗂️ Cấu Trúc Dự Án

```
quanlydonhang/
├── backend/
│   ├── server.js           # Server chính (Express API)
│   ├── package.json        # Dependencies
│   ├── .gitignore         # Ignore files
│   └── orders.db          # SQLite database (tự động tạo)
│
└── fronend/               # Frontend files
    ├── index.html         # Giao diện chính
    ├── styles.css         # Styling (responsive)
    └── app.js             # JavaScript logic
```

## 🔌 API Endpoints

### 1. GET `/api/orders`

Lấy danh sách tất cả đơn hàng

### 2. POST `/api/orders`

Tạo đơn hàng mới

```json
{
  "order_code": "DH123456",
  "amount": 150000,
  "payment_status": "paid",
  "payment_method": "bank_transfer"
}
```

### 3. PUT `/api/orders/:id`

Cập nhật đơn hàng

```json
{
  "payment_status": "paid",
  "payment_method": "cash"
}
```

### 4. DELETE `/api/orders/:id`

Xóa đơn hàng

### 5. GET `/api/orders/search`

Tìm kiếm đơn hàng

```
?order_code=123&amount=150000&min_amount=100000&max_amount=200000
```

### 6. GET `/api/stats`

Lấy thống kê

## 💾 Database Schema

```sql
CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  order_code TEXT NOT NULL UNIQUE,
  amount REAL NOT NULL,
  payment_status TEXT NOT NULL CHECK(payment_status IN ('paid', 'unpaid')),
  payment_method TEXT CHECK(payment_method IN ('bank_transfer', 'cash', 'later')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

## 📱 Responsive Design

Ứng dụng được thiết kế responsive, hoạt động tốt trên:

- 📱 Mobile (Portrait & Landscape)
- 📱 Tablet
- 💻 Desktop

## 🛠️ Công Nghệ Sử Dụng

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **SQLite3** (better-sqlite3) - Database
- **CORS** - Cross-Origin Resource Sharing

### Frontend

- **HTML5** - Markup
- **CSS3** - Styling (Flexbox, Grid, Gradient)
- **Vanilla JavaScript** - Logic (Fetch API)
- **PWA** - Progressive Web App với Service Worker
  - Manifest.json cho installable app
  - Service Worker cho offline support & caching
  - iOS/Android home screen icons

## 🔧 Troubleshooting

### Lỗi: "Cannot connect to server"

- Đảm bảo server đang chạy (`npm start` trong thư mục backend)
- Kiểm tra port 3000 không bị chiếm bởi ứng dụng khác

### Lỗi: "Mã đơn hàng đã tồn tại"

- Mỗi mã đơn chỉ được lưu 1 lần
- Kiểm tra lại mã đơn hoặc xóa đơn cũ

### Database bị lỗi

- Xóa file `orders.db` trong thư mục backend
- Restart server để tạo database mới

## 📝 Ghi Chú

- Database được lưu trong file `orders.db` tại thư mục backend
- Dữ liệu sẽ được giữ nguyên khi restart server
- Backup file `orders.db` để sao lưu dữ liệu

## 🎯 Tính Năng Mở Rộng (Tương Lai)

- [x] **Progressive Web App (PWA)** - ✅ Đã hoàn thành! Cài đặt như app native
- [ ] Export danh sách đơn hàng ra Excel
- [ ] Thống kê theo ngày/tháng
- [ ] Đăng nhập/Đăng ký tài khoản
- [ ] Push notification cho đơn hàng mới
- [ ] Backup tự động lên cloud

## 📞 Hỗ Trợ

Nếu gặp vấn đề, vui lòng:

1. Kiểm tra console log trong trình duyệt (F12)
2. Kiểm tra terminal log của server
3. Đọc lại hướng dẫn cài đặt

---

**Chúc bạn sử dụng hiệu quả! 🚀📦**
