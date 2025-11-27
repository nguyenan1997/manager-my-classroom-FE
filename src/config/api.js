// API Configuration
import axios from 'axios'
import { API_BASE_URL } from './constants'

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    PARENT_REGISTER: '/api/auth/parent/register',
    PARENT_LOGIN: '/api/auth/parent/login'
  },
  PARENTS: {
    LOGIN: '/api/parents/login',
    REGISTER: '/api/parents/register'
  }
}

// Helper function to get auth token
export const getAuthToken = () => {
  return localStorage.getItem('token')
}

// Helper function to set auth token
export const setAuthToken = (token) => {
  localStorage.setItem('token', token)
  // Update axios default header
  axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
}

// Helper function to remove auth token
export const removeAuthToken = () => {
  localStorage.removeItem('token')
  // Remove axios default header
  delete axiosInstance.defaults.headers.common['Authorization']
}

// Create axios instance with default config
export const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      removeAuthToken()
      // Optionally redirect to login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Helper function to make API calls with authentication
export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await axiosInstance({
      url: endpoint,
      ...options
    })
    return response
  } catch (error) {
    throw error
  }
}

