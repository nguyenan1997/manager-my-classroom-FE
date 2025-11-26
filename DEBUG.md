# Hướng dẫn Debug

## Nếu không thấy hiển thị các view, hãy kiểm tra:

### 1. Đảm bảo đã cài đặt dependencies
```bash
npm install
```

### 2. Chạy dev server
```bash
npm run dev
```

### 3. Kiểm tra browser console
- Mở Developer Tools (F12)
- Xem tab Console có lỗi gì không
- Xem tab Network có file nào load failed không

### 4. Kiểm tra URL
- Đảm bảo đang truy cập đúng URL: `http://localhost:3000`
- Thử các route:
  - `/` - Dashboard
  - `/students` - Quản lý học sinh
  - `/classes` - Quản lý lớp học
  - `/subscriptions` - Quản lý gói học

### 5. Kiểm tra các file tồn tại
Tất cả các file sau phải tồn tại:
- ✅ `src/main.js`
- ✅ `src/App.vue`
- ✅ `src/views/Dashboard.vue`
- ✅ `src/views/Students.vue`
- ✅ `src/views/Classes.vue`
- ✅ `src/views/Subscriptions.vue`
- ✅ `src/stores/useAppStore.js`
- ✅ `src/components/Navbar.vue`
- ✅ `src/components/Footer.vue`

### 6. Kiểm tra lỗi thường gặp

#### Lỗi: "Cannot find module"
- Chạy lại `npm install`
- Xóa `node_modules` và `package-lock.json`, sau đó chạy `npm install` lại

#### Lỗi: "Failed to resolve component"
- Kiểm tra import path có đúng không
- Đảm bảo file component tồn tại

#### Lỗi: "Pinia store not found"
- Kiểm tra `src/stores/useAppStore.js` có tồn tại không
- Kiểm tra import trong các view có đúng không

### 7. Clear cache và rebuild
```bash
# Xóa cache
rm -rf node_modules/.vite

# Hoặc trên Windows PowerShell
Remove-Item -Recurse -Force node_modules\.vite

# Chạy lại dev server
npm run dev
```

### 8. Kiểm tra Vite config
Đảm bảo `vite.config.js` có cấu hình đúng:
- Plugin Vue được thêm
- Port 3000 được set

Nếu vẫn không hoạt động, hãy kiểm tra console log trong browser và gửi lỗi cụ thể.

