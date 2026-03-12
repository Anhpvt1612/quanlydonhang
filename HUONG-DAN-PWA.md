# 📱 Hướng Dẫn Cài Đặt PWA trên iOS

## ✅ Ứng dụng của bạn đã được chuyển thành Progressive Web App!

Bây giờ bạn có thể cài đặt nó lên iPhone/iPad như một ứng dụng thực sự.

---

## 📋 Các Bước Cài Đặt trên iPhone/iPad

### Bước 1: Tìm địa chỉ IP của máy tính

Trên Windows, mở **Command Prompt** và chạy:
```
ipconfig
```

Tìm dòng **"IPv4 Address"**, ví dụ: `192.168.1.100`

### Bước 2: Truy cập từ iPhone

1. Mở **Safari** trên iPhone/iPad
2. Truy cập: `http://[IP-máy-tính]:3000`
   - Ví dụ: `http://192.168.1.100:3000`
3. **Lưu ý**: Đảm bảo iPhone và máy tính cùng mạng WiFi

### Bước 3: Cài Đặt Ứng Dụng

1. Khi trang web đã load, nhấn nút **Share** (chia sẻ) ⬆️ ở thanh dưới cùng

2. Trong menu, **cuộn xuống** và tìm **"Add to Home Screen"**
   - Tiếng Việt: **"Thêm vào Màn hình chính"**

3. Đặt tên cho app (mặc định: "Quản Lý Đơn")

4. Nhấn **"Add"** (Thêm) ở góc trên phải

5. ✅ **Hoàn thành!** Icon app sẽ xuất hiện trên màn hình chính

### Bước 4: Sử Dụng

- Mở ứng dụng từ màn hình chính như bất kỳ app nào
- App sẽ chạy toàn màn hình, không có thanh địa chỉ Safari
- Hoạt động giống như một ứng dụng native!

---

## 🌟 Tính Năng PWA

✅ **Offline Support**: Các trang đã tải sẽ được cache
✅ **Toàn màn hình**: Không có thanh địa chỉ, trông như app thật
✅ **Icon đẹp**: Icon gradient với hình hộp đơn hàng
✅ **Nhanh**: Tải trang nhanh nhờ Service Worker caching
✅ **Cập nhật tự động**: Khi bạn cập nhật code, app tự động reload

---

## 🔧 Troubleshooting

### Không thấy nút "Add to Home Screen"?
- Đảm bảo bạn đang dùng **Safari** (không phải Chrome)
- iOS yêu cầu HTTPS hoặc localhost cho PWA
- Nếu dùng IP address, một số tính năng PWA có thể bị giới hạn

### Không kết nối được từ iPhone?
- Kiểm tra máy tính và iPhone cùng mạng WiFi
- Tắt firewall tạm thời để test
- Thử truy cập `http://[IP]:3000` từ Safari

### Icon không hiển thị đẹp?
- Xóa app khỏi màn hình chính
- Xóa cache Safari
- Thêm lại app

---

## 📱 Cài Đặt trên Android

Trên Android đơn giản hơn:

1. Mở Chrome và truy cập `http://[IP]:3000`
2. Nhấn nút **"Cài Đặt Ứng Dụng"** xuất hiện ở dưới màn hình
3. Hoặc menu (⋮) → **"Add to Home screen"**
4. Xác nhận → Xong!

---

## 🚀 Deploy Online (Tùy chọn)

Để sử dụng mà không cần cùng WiFi, bạn có thể deploy lên:

- **Vercel**: Free, dễ dàng (https://vercel.com)
- **Heroku**: Free tier available
- **Railway**: Modern deployment
- **Netlify**: Good for static + serverless

Sau khi deploy, bạn sẽ có URL như: `https://quanlydonhang.vercel.app`
Lúc đó có thể cài PWA từ bất kỳ đâu!

---

**🎉 Chúc mừng! Ứng dụng của bạn giờ có thể cài đặt như một app thật!**
