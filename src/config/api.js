// API Configuration
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
}

// Helper function to remove auth token
export const removeAuthToken = () => {
  localStorage.removeItem('token')
}

// Helper function to make API calls with authentication
export const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken()
  
  const defaultHeaders = {
    'Content-Type': 'application/json'
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  })

  return response
}

