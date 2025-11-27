// API Base URL Configuration
// Có thể thay đổi URL này thông qua environment variable VITE_API_BASE_URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

// Các cấu hình khác có thể thêm vào đây
export const APP_CONFIG = {
  API_TIMEOUT: 30000, // 30 seconds
  MAX_RETRY: 3
}

