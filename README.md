# PV Technical - Frontend

Dự án Frontend base sử dụng Vue.js và Tailwind CSS.

## 🚀 Công nghệ sử dụng

- **Vue.js 3** - Framework JavaScript tiên tiến
- **Vite** - Build tool nhanh chóng
- **Tailwind CSS** - Utility-first CSS framework
- **Vue Router** - Router chính thức cho Vue.js

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
│   ├── components/     # Các component Vue
│   │   ├── Navbar.vue
│   │   └── Footer.vue
│   ├── views/          # Các trang/views
│   │   ├── Home.vue
│   │   └── About.vue
│   ├── App.vue         # Component chính
│   ├── main.js         # Entry point
│   └── style.css       # Tailwind CSS
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

### Thêm routes mới

Thêm routes trong file `src/main.js`:

```js
const routes = [
  // Thêm routes mới tại đây
]
```

## 📝 License

MIT

