import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API_ENDPOINTS, setAuthToken, removeAuthToken, axiosInstance } from '../config/api'

export const useAppStore = defineStore('app', () => {
  // Authentication
  const currentUser = ref(null)
  const userRole = ref(null) // 'manager' or 'parent'
  
  // Students & Parents
  const students = ref([])
  const parents = ref([])
  
  // Classes
  const classes = ref([])
  
  // Subscriptions
  const subscriptions = ref([])

  // Students & Parents Actions
  const addStudent = (student) => {
    const newStudent = {
      id: Date.now().toString(),
      ...student,
      createdAt: new Date().toISOString()
    }
    students.value.push(newStudent)
    return newStudent
  }

  const updateStudent = (id, updates) => {
    const index = students.value.findIndex(s => s.id === id)
    if (index !== -1) {
      students.value[index] = { ...students.value[index], ...updates }
      return students.value[index]
    }
    return null
  }

  const deleteStudent = (id) => {
    const index = students.value.findIndex(s => s.id === id)
    if (index !== -1) {
      students.value.splice(index, 1)
      // Also delete related subscriptions
      subscriptions.value = subscriptions.value.filter(sub => sub.studentId !== id)
      return true
    }
    return false
  }

  const getStudentById = (id) => {
    return students.value.find(s => s.id === id)
  }

  // Parents Actions
  const addParent = (parent) => {
    const newParent = {
      id: Date.now().toString(),
      ...parent,
      createdAt: new Date().toISOString()
    }
    parents.value.push(newParent)
    return newParent
  }

  const updateParent = (id, updates) => {
    const index = parents.value.findIndex(p => p.id === id)
    if (index !== -1) {
      parents.value[index] = { ...parents.value[index], ...updates }
      return parents.value[index]
    }
    return null
  }

  const deleteParent = (id) => {
    const index = parents.value.findIndex(p => p.id === id)
    if (index !== -1) {
      parents.value.splice(index, 1)
      return true
    }
    return false
  }

  // Classes Actions
  const addClass = (classData) => {
    const newClass = {
      id: Date.now().toString(),
      ...classData,
      createdAt: new Date().toISOString()
    }
    classes.value.push(newClass)
    return newClass
  }

  const updateClass = (id, updates) => {
    const index = classes.value.findIndex(c => c.id === id)
    if (index !== -1) {
      classes.value[index] = { ...classes.value[index], ...updates }
      return classes.value[index]
    }
    return null
  }

  const deleteClass = (id) => {
    const index = classes.value.findIndex(c => c.id === id)
    if (index !== -1) {
      classes.value.splice(index, 1)
      return true
    }
    return false
  }

  const getClassById = (id) => {
    return classes.value.find(c => c.id === id)
  }

  // Subscriptions Actions
  const addSubscription = (subscription) => {
    const newSubscription = {
      id: Date.now().toString(),
      totalSessions: subscription.totalSessions || 0,
      usedSessions: 0,
      remainingSessions: subscription.totalSessions || 0,
      ...subscription,
      createdAt: new Date().toISOString()
    }
    subscriptions.value.push(newSubscription)
    return newSubscription
  }

  const updateSubscription = (id, updates) => {
    const index = subscriptions.value.findIndex(s => s.id === id)
    if (index !== -1) {
      const updated = { ...subscriptions.value[index], ...updates }
      // Recalculate remaining sessions
      updated.remainingSessions = updated.totalSessions - updated.usedSessions
      subscriptions.value[index] = updated
      return updated
    }
    return null
  }

  const useSession = (subscriptionId) => {
    const subscription = subscriptions.value.find(s => s.id === subscriptionId)
    if (subscription && subscription.remainingSessions > 0) {
      subscription.usedSessions += 1
      subscription.remainingSessions -= 1
      return true
    }
    return false
  }

  const deleteSubscription = (id) => {
    const index = subscriptions.value.findIndex(s => s.id === id)
    if (index !== -1) {
      subscriptions.value.splice(index, 1)
      return true
    }
    return false
  }

  const getSubscriptionById = (id) => {
    return subscriptions.value.find(s => s.id === id)
  }

  const getSubscriptionsByStudent = (studentId) => {
    return subscriptions.value.filter(s => s.studentId === studentId)
  }

  // Authentication Actions
  const loginManager = async (credentials) => {
    try {
      // Call API to login manager
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.LOGIN, {
        email: credentials.email,
        password: credentials.password
      })

      const result = response.data

      // Check success field (some APIs might not have this field)
      if (result.success === false) {
        return { success: false, message: result.message || result.error }
      }

      // If response is ok but no success field, assume it's successful if we have data
      if (result.success !== true && !result.data) {
        return { success: false, message: 'Định dạng phản hồi không hợp lệ' }
      }

      // Save token
      if (result.data && result.data.token) {
        setAuthToken(result.data.token)
      }

      // Save user info
      if (result.data && result.data.user) {
        currentUser.value = {
          id: result.data.user.id,
          email: result.data.user.email,
          role: result.data.user.role || 'admin',
          name: result.data.user.name || 'Quản lý'
        }
        userRole.value = 'manager'
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
        localStorage.setItem('userRole', userRole.value)
        
        return { success: true }
      }

      return { success: false, message: 'Không có dữ liệu người dùng trong phản hồi' }
    } catch (error) {
      // Handle axios errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Đăng nhập thất bại'
        return { success: false, message: errorMessage }
      } else if (error.request) {
        // Request was made but no response received
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        // Something else happened
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const registerParent = async (parentData) => {
    try {
      // Call API to register parent
      const response = await axiosInstance.post(API_ENDPOINTS.AUTH.PARENT_REGISTER, {
        name: parentData.name,
        email: parentData.email,
        phone: parentData.phone,
        password: parentData.password
      })

      const result = response.data

      // Check success field
      if (result.success === false) {
        return { success: false, message: result.message || result.error }
      }

      // If response is ok but no success field, assume it's successful if we have data
      if (result.success !== true && !result.data) {
        return { success: false, message: 'Định dạng phản hồi không hợp lệ' }
      }

      // Save token if available
      if (result.data && result.data.token) {
        setAuthToken(result.data.token)
      }

      // Save parent info and auto login after registration
      if (result.data && result.data.parent) {
        const parent = result.data.parent
        
        currentUser.value = {
          id: parent.id,
          name: parent.name || parentData.name || 'Phụ huynh',
          phone: parent.phone || parentData.phone,
          email: parent.email || parentData.email,
          role: 'parent',
          studentId: null, // Will be set when student is linked
          studentName: null
        }
        userRole.value = 'parent'
        
        // Save to localStorage
        localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
        localStorage.setItem('userRole', userRole.value)
        
        return { success: true }
      }

      return { success: false, message: 'Không có dữ liệu người dùng trong phản hồi' }
    } catch (error) {
      // Handle axios errors
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Đăng ký thất bại'
        return { success: false, message: errorMessage }
      } else if (error.request) {
        // Request was made but no response received
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        // Something else happened
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const loginParent = async (credentials) => {
    try {
      // Use the correct endpoint: /api/auth/parent/login
      const endpoint = API_ENDPOINTS.AUTH.PARENT_LOGIN
      
      // Detect if identifier is email or phone
      const isEmail = credentials.identifier.includes('@')
      
      // Backend requires email or phone field, not identifier
      const requestBody = isEmail 
        ? { email: credentials.identifier, password: credentials.password }
        : { phone: credentials.identifier, password: credentials.password }
      
      const response = await axiosInstance.post(endpoint, requestBody)
      const data = response.data

      // Check if API returned success: false
      if (data.success === false) {
        return { success: false, message: data.message || data.error }
      }

      // Extract parent data from response (handle different response formats)
      const parentData = data.data?.parent || data.data || data.parent || data
      
      if (!parentData || !parentData.id) {
        return { success: false, message: 'Không có dữ liệu người dùng trong phản hồi' }
      }

      // Get student info if available
      const student = students.value.find(s => 
        s.parentPhone === parentData.phone || 
        s.id === parentData.studentId
      )

      // Save token if available
      if (data.token || data.data?.token) {
        setAuthToken(data.token || data.data.token)
      }

      // Set current user
      currentUser.value = {
        id: parentData.id,
        name: parentData.name || 'Phụ huynh',
        phone: parentData.phone,
        email: parentData.email,
        role: 'parent',
        studentId: parentData.studentId || null,
        studentName: student ? student.name : null
      }
      userRole.value = 'parent'
      
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
      localStorage.setItem('userRole', userRole.value)
      
      return { success: true }
    } catch (error) {
      // Handle axios errors - chỉ trả về lỗi từ backend
      if (error.response) {
        // Server responded with error status - dùng message từ backend
        const errorMessage = error.response.data?.message || error.response.data?.error || 'Đăng nhập thất bại'
        return { success: false, message: errorMessage }
      } else if (error.request) {
        // Request was made but no response received
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        // Something else happened
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const logout = () => {
    currentUser.value = null
    userRole.value = null
    localStorage.removeItem('currentUser')
    localStorage.removeItem('userRole')
    removeAuthToken()
  }

  const checkAuth = () => {
    // Check localStorage for persisted session
    const savedUser = localStorage.getItem('currentUser')
    const savedRole = localStorage.getItem('userRole')
    const savedToken = localStorage.getItem('token')
    
    if (savedUser && savedRole && savedToken) {
      currentUser.value = JSON.parse(savedUser)
      userRole.value = savedRole
      // Token is already in localStorage, no need to set it again
    }
  }

  const isAuthenticated = computed(() => {
    return currentUser.value !== null
  })

  const isManager = computed(() => {
    return userRole.value === 'manager'
  })

  const isParent = computed(() => {
    return userRole.value === 'parent'
  })

  return {
    // Auth State
    currentUser,
    userRole,
    isAuthenticated,
    isManager,
    isParent,
    // State
    students,
    parents,
    classes,
    subscriptions,
    // Auth Actions
    loginManager,
    registerParent,
    loginParent,
    logout,
    checkAuth,
    // Students Actions
    addStudent,
    updateStudent,
    deleteStudent,
    getStudentById,
    // Parents Actions
    addParent,
    updateParent,
    deleteParent,
    // Classes Actions
    addClass,
    updateClass,
    deleteClass,
    getClassById,
    // Subscriptions Actions
    addSubscription,
    updateSubscription,
    useSession,
    deleteSubscription,
    getSubscriptionById,
    getSubscriptionsByStudent
  }
})

