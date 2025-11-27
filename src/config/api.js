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
    LOGIN: '/api/auth/parent/login',
    REGISTER: '/api/parents/register'
  },
  STUDENTS: {
    CREATE: '/api/students',
    MY_CHILDREN: '/api/students/my-children', // For parent to get their children
    GET_BY_ID: '/api/students', // Will append /{id}
    UPDATE: '/api/students', // Will append /{id}
    DELETE: '/api/students', // Will append /{id}
    GET_CLASSES: '/api/students' // Will append /{student_id}/classes
  },
  PARENTS: {
    UPDATE: '/api/parents', // Will append /{id}
    DELETE: '/api/parents' // Will append /{id}
  },
  CLASSES: {
    CREATE: '/api/classes',
    LIST: '/api/classes',
    REGISTER: '/api/classes', // Will append /{class_id}/register
    UPDATE: '/api/classes', // Will append /{id}
    DELETE: '/api/classes' // Will append /{id}
  },
  SUBSCRIPTIONS: {
    CREATE: '/api/subscriptions',
    LIST: '/api/subscriptions', // Get all subscriptions
    GET_BY_ID: '/api/subscriptions', // Will append /{id}
    UPDATE: '/api/subscriptions', // Will append /{id}
    DELETE: '/api/subscriptions', // Will append /{id}
    USE_SESSION: '/api/subscriptions' // Will append /{id}/use
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

