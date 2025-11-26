# PV Technical - Frontend

Ứng dụng web quản lý học sinh với Vue.js và Tailwind CSS.

## ✨ Tính năng

- **Quản lý Học sinh - Phụ huynh**: CRUD đầy đủ thông tin học sinh và phụ huynh
- **Quản lý Lớp học**: Tạo và lên lịch lớp học với thời gian, lịch học trong tuần
- **Quản lý Subscription**: Theo dõi gói học, số buổi đã dùng/còn lại
- **Dashboard**: Tổng quan thống kê hệ thống

## 🚀 Công nghệ sử dụng

- **Vue.js 3** - Framework JavaScript với Composition API
- **Vite** - Build tool nhanh chóng
- **Tailwind CSS** - Utility-first CSS framework
- **Vue Router** - Router chính thức cho Vue.js
- **Pinia** - State management cho Vue.js

## 📦 Cài đặt

```bash
# Cài đặt dependencies
npm install
```

## 🛠️ Development

```bash
# Chạy development server
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## 🏗️ Build

```bash
# Build cho production
npm run build
```

## 📁 Cấu trúc dự án

```
FE/
├── src/
│   ├── components/        # Các component Vue
│   │   ├── Navbar.vue
│   │   ├── Footer.vue
│   │   ├── StudentModal.vue
│   │   ├── ClassModal.vue
│   │   └── SubscriptionModal.vue
│   ├── views/              # Các trang/views
│   │   ├── Dashboard.vue
│   │   ├── Students.vue
│   │   ├── Classes.vue
│   │   └── Subscriptions.vue
│   ├── stores/            # Pinia stores
│   │   └── useAppStore.js
│   ├── App.vue            # Component chính
│   ├── main.js            # Entry point
│   └── style.css          # Tailwind CSS
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## 🎨 Customization

### Thay đổi màu sắc

Chỉnh sửa file `tailwind.config.js` để thay đổi theme colors:

```js
theme: {
  extend: {
    colors: {
      primary: {
        // Thay đổi màu primary tại đây
      }
    }
  }
}
```

## 🎯 Hướng dẫn sử dụng

### Quản lý Học sinh
1. Vào trang "Học sinh" từ menu
2. Click "Thêm học sinh" để tạo mới
3. Điền thông tin học sinh và phụ huynh
4. Có thể chỉnh sửa hoặc xóa học sinh

### Quản lý Lớp học
1. Vào trang "Lớp học"
2. Click "Tạo lớp học"
3. Điền thông tin: tên lớp, thời gian, lịch học trong tuần
4. Chọn học sinh tham gia lớp

### Quản lý Gói học
1. Vào trang "Gói học"
2. Click "Tạo gói học"
3. Chọn học sinh và điền số buổi học
4. Click "Sử dụng" để trừ buổi học khi học sinh đi học
5. Theo dõi số buổi còn lại qua progress bar

## 💾 Lưu ý

- Dữ liệu hiện tại được lưu trong memory (Pinia store)
- Để lưu trữ lâu dài, cần tích hợp với Backend API
- Dữ liệu sẽ mất khi refresh trang (chưa có persistence)

## 📝 License

MIT

