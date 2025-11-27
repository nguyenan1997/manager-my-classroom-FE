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
  const addStudent = async (studentData) => {
    try {
      // Determine parent_id: use from studentData if provided (manager), otherwise use currentUser.id (parent)
      const parentId = studentData.parent_id || currentUser.value?.id
      
      // Call API to create student
      const response = await axiosInstance.post(API_ENDPOINTS.STUDENTS.CREATE, {
        name: studentData.name,
        parent_id: parentId,
        dob: studentData.dob,
        gender: studentData.gender,
        current_grade: studentData.current_grade
      })

      const result = response.data

      if (result.success === false) {
        return { success: false, message: result.message || result.error }
      }

      // Extract student data from response
      const student = result.data?.student || result.data || result
      
      // Add to local store
      students.value.push(student)
      
      return { success: true, data: student }
    } catch (error) {
      if (error.response) {
        return { success: false, message: error.response.data?.message || error.response.data?.error }
      } else if (error.request) {
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const updateStudent = async (id, updates) => {
    try {
      const endpoint = `${API_ENDPOINTS.STUDENTS.UPDATE}/${id}`
      const response = await axiosInstance.put(endpoint, {
        name: updates.name,
        dob: updates.dob,
        gender: updates.gender,
        current_grade: updates.current_grade
      })

      const result = response.data

      if (result.success === false) {
        return { success: false, message: result.message || result.error }
      }

      // Update local store
      const updatedStudent = result.data?.student || result.data || result
      const index = students.value.findIndex(s => s.id === id)
      if (index !== -1) {
        students.value[index] = updatedStudent
      }

      return { success: true, data: updatedStudent }
    } catch (error) {
      if (error.response) {
        return { success: false, message: error.response.data?.message || error.response.data?.error }
      } else if (error.request) {
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const deleteStudent = async (id) => {
    try {
      const endpoint = `${API_ENDPOINTS.STUDENTS.DELETE}/${id}`
      const response = await axiosInstance.delete(endpoint)

      const result = response.data

      if (result.success === false) {
        return { success: false, message: result.message || result.error }
      }

      // Remove from local store
      const index = students.value.findIndex(s => s.id === id)
      if (index !== -1) {
        students.value.splice(index, 1)
      }
      // Also delete related subscriptions
      subscriptions.value = subscriptions.value.filter(sub => 
        (sub.studentId !== id && sub.student_id !== id)
      )

      return { success: true }
    } catch (error) {
      if (error.response) {
        return { success: false, message: error.response.data?.message || error.response.data?.error }
      } else if (error.request) {
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const getStudentClasses = async (studentId) => {
    try {
      const endpoint = `${API_ENDPOINTS.STUDENTS.GET_CLASSES}/${studentId}/classes`
      const response = await axiosInstance.get(endpoint)
      const result = response.data

      if (result.success === false) {
        return { success: false, message: result.message || result.error }
      }

      // Extract classes array from response
      const classesList = result.data?.classes || result.data || result.classes || []
      return { success: true, data: classesList }
    } catch (error) {
      if (error.response) {
        return { success: false, message: error.response.data?.message || error.response.data?.error }
      } else if (error.request) {
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const getStudentById = (id) => {
    return students.value.find(s => s.id === id)
  }

  const fetchStudentById = async (id) => {
    try {
      const endpoint = `${API_ENDPOINTS.STUDENTS.GET_BY_ID}/${id}`
      const response = await axiosInstance.get(endpoint)
      const result = response.data

      if (result.success === false) {
        return { success: false, message: result.message || result.error }
      }

      // Extract student data from response
      const student = result.data?.student || result.data || result
      
      return { success: true, data: student }
    } catch (error) {
      if (error.response) {
        return { success: false, message: error.response.data?.message || error.response.data?.error }
      } else if (error.request) {
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const loadStudents = async () => {
    try {
      // Chỉ parent mới có API để load students
      if (!isParent.value) {
        // Manager chưa có API để load tất cả students
        students.value = []
        return { success: true }
      }
      
      const response = await axiosInstance.get(API_ENDPOINTS.STUDENTS.MY_CHILDREN)
      const result = response.data

      if (result.success === false) {
        console.error('Failed to load students:', result.message || result.error)
        return { success: false, message: result.message || result.error }
      }

      // Extract students array from response
      // Response structure: { success: true, count: 2, data: [...] }
      // data is directly an array, not data.students
      const studentsList = result.data || []
      students.value = Array.isArray(studentsList) ? studentsList : []

      return { success: true }
    } catch (error) {
      if (error.response) {
        console.error('Failed to load students:', error.response.data?.message || error.response.data?.error)
        return { success: false, message: error.response.data?.message || error.response.data?.error }
      } else if (error.request) {
        console.error('Failed to load students: No response from server')
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        console.error('Failed to load students:', error.message)
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
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

  const updateParent = async (id, updates) => {
    try {
      const endpoint = `${API_ENDPOINTS.PARENTS.UPDATE}/${id}`
      const response = await axiosInstance.put(endpoint, {
        name: updates.name,
        phone: updates.phone,
        email: updates.email
      })

      const result = response.data

      if (result.success === false) {
        return { success: false, message: result.message || result.error }
      }

      // Update local store
      const updatedParent = result.data?.parent || result.data || result
      const index = parents.value.findIndex(p => p.id === id)
      if (index !== -1) {
        parents.value[index] = updatedParent
      }

      return { success: true, data: updatedParent }
    } catch (error) {
      if (error.response) {
        return { success: false, message: error.response.data?.message || error.response.data?.error }
      } else if (error.request) {
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const deleteParent = async (id) => {
    try {
      const endpoint = `${API_ENDPOINTS.PARENTS.DELETE}/${id}`
      const response = await axiosInstance.delete(endpoint)

      const result = response.data

      if (result.success === false) {
        return { success: false, message: result.message || result.error }
      }

      // Remove from local store
      const index = parents.value.findIndex(p => p.id === id)
      if (index !== -1) {
        parents.value.splice(index, 1)
      }

      return { success: true }
    } catch (error) {
      if (error.response) {
        return { success: false, message: error.response.data?.message || error.response.data?.error }
      } else if (error.request) {
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  // Classes Actions
  const addClass = async (classData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.CLASSES.CREATE, {
        name: classData.name,
        subject: classData.subject,
        day_of_week: classData.day_of_week,
        time_slot: classData.time_slot,
        teacher_name: classData.teacher_name,
        max_students: classData.max_students
      })

      const result = response.data

      if (result.success === false) {
        return { success: false, message: result.message || result.error }
      }

      // Extract class data from response
      const newClass = result.data?.class || result.data || result
      
      // Add to local store
      classes.value.push(newClass)
      
      return { success: true, data: newClass }
    } catch (error) {
      if (error.response) {
        return { success: false, message: error.response.data?.message || error.response.data?.error }
      } else if (error.request) {
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const loadClasses = async (day = null) => {
    try {
      const params = day ? { day } : {}
      const response = await axiosInstance.get(API_ENDPOINTS.CLASSES.LIST, { params })
      const result = response.data

      if (result.success === false) {
        console.error('Failed to load classes:', result.message || result.error)
        return { success: false, message: result.message || result.error }
      }

      // Extract classes array from response
      const classesList = result.data?.classes || result.data || result.classes || []
      classes.value = Array.isArray(classesList) ? classesList : []

      return { success: true }
    } catch (error) {
      if (error.response) {
        console.error('Failed to load classes:', error.response.data?.message || error.response.data?.error)
        return { success: false, message: error.response.data?.message || error.response.data?.error }
      } else if (error.request) {
        console.error('Failed to load classes: No response from server')
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        console.error('Failed to load classes:', error.message)
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const registerStudentToClass = async (classId, studentId) => {
    try {
      const endpoint = `${API_ENDPOINTS.CLASSES.REGISTER}/${classId}/register`
      const response = await axiosInstance.post(endpoint, {
        student_id: studentId
      })

      const result = response.data

      if (result.success === false) {
        return { success: false, message: result.message || result.error }
      }

      return { success: true, data: result.data }
    } catch (error) {
      if (error.response) {
        return { success: false, message: error.response.data?.message || error.response.data?.error }
      } else if (error.request) {
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const updateClass = async (id, updates) => {
    try {
      const endpoint = `${API_ENDPOINTS.CLASSES.UPDATE}/${id}`
      const response = await axiosInstance.put(endpoint, {
        name: updates.name,
        subject: updates.subject,
        day_of_week: updates.day_of_week,
        time_slot: updates.time_slot,
        teacher_name: updates.teacher_name,
        max_students: updates.max_students
      })

      const result = response.data

      if (result.success === false) {
        return { success: false, message: result.message || result.error }
      }

      // Update local store
      const updatedClass = result.data?.class || result.data || result
      const index = classes.value.findIndex(c => c.id === id)
      if (index !== -1) {
        classes.value[index] = updatedClass
      }

      return { success: true, data: updatedClass }
    } catch (error) {
      if (error.response) {
        return { success: false, message: error.response.data?.message || error.response.data?.error }
      } else if (error.request) {
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const deleteClass = async (id) => {
    try {
      const endpoint = `${API_ENDPOINTS.CLASSES.DELETE}/${id}`
      const response = await axiosInstance.delete(endpoint)

      const result = response.data

      if (result.success === false) {
        return { success: false, message: result.message || result.error }
      }

      // Remove from local store
      const index = classes.value.findIndex(c => c.id === id)
      if (index !== -1) {
        classes.value.splice(index, 1)
      }

      return { success: true }
    } catch (error) {
      if (error.response) {
        return { success: false, message: error.response.data?.message || error.response.data?.error }
      } else if (error.request) {
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const getClassById = (id) => {
    return classes.value.find(c => c.id === id)
  }

  // Subscriptions Actions
  const loadSubscriptions = async (studentId = null) => {
    try {
      const params = {}
      if (studentId) {
        params.student_id = studentId
      }
      
      const response = await axiosInstance.get(API_ENDPOINTS.SUBSCRIPTIONS.LIST, { params })
      const result = response.data

      if (result.success === false) {
        console.error('Failed to load subscriptions:', result.message || result.error)
        return { success: false, message: result.message || result.error }
      }

      // Extract subscriptions array from response
      // Response structure: { success: true, count: 3, data: [...] }
      const subscriptionsList = result.data || []
      subscriptions.value = Array.isArray(subscriptionsList) ? subscriptionsList : []

      return { success: true, count: result.count || subscriptionsList.length }
    } catch (error) {
      if (error.response) {
        console.error('Failed to load subscriptions:', error.response.data?.message || error.response.data?.error)
        return { success: false, message: error.response.data?.message || error.response.data?.error }
      } else if (error.request) {
        console.error('Failed to load subscriptions: No response from server')
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        console.error('Failed to load subscriptions:', error.message)
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const addSubscription = async (subscriptionData) => {
    try {
      const response = await axiosInstance.post(API_ENDPOINTS.SUBSCRIPTIONS.CREATE, {
        student_id: subscriptionData.student_id,
        package_name: subscriptionData.package_name,
        total_sessions: subscriptionData.total_sessions,
        start_date: subscriptionData.start_date,
        end_date: subscriptionData.end_date || null
      })

      const result = response.data

      if (result.success === false) {
        return { success: false, message: result.message || result.error }
      }

      // Extract subscription data from response
      const subscription = result.data?.subscription || result.data || result
      
      // Add to local store
      subscriptions.value.push(subscription)
      
      return { success: true, data: subscription }
    } catch (error) {
      if (error.response) {
        return { success: false, message: error.response.data?.message || error.response.data?.error }
      } else if (error.request) {
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const fetchSubscriptionById = async (id) => {
    try {
      const endpoint = `${API_ENDPOINTS.SUBSCRIPTIONS.GET_BY_ID}/${id}`
      const response = await axiosInstance.get(endpoint)
      const result = response.data

      if (result.success === false) {
        return { success: false, message: result.message || result.error }
      }

      // Extract subscription data from response
      const subscription = result.data?.subscription || result.data || result
      
      return { success: true, data: subscription }
    } catch (error) {
      if (error.response) {
        return { success: false, message: error.response.data?.message || error.response.data?.error }
      } else if (error.request) {
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const useSession = async (subscriptionId) => {
    try {
      const endpoint = `${API_ENDPOINTS.SUBSCRIPTIONS.USE_SESSION}/${subscriptionId}/use`
      const response = await axiosInstance.patch(endpoint)

      const result = response.data

      if (result.success === false) {
        return { success: false, message: result.message || result.error }
      }

      // Update local store
      const subscription = subscriptions.value.find(s => s.id === subscriptionId)
      if (subscription) {
        const updatedSubscription = result.data?.subscription || result.data || result
        const index = subscriptions.value.findIndex(s => s.id === subscriptionId)
        if (index !== -1) {
          subscriptions.value[index] = updatedSubscription
        }
      }

      return { success: true, data: result.data }
    } catch (error) {
      if (error.response) {
        return { success: false, message: error.response.data?.message || error.response.data?.error }
      } else if (error.request) {
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const updateSubscription = async (id, updates) => {
    try {
      const endpoint = `${API_ENDPOINTS.SUBSCRIPTIONS.UPDATE}/${id}`
      const response = await axiosInstance.put(endpoint, {
        package_name: updates.package_name,
        total_sessions: updates.total_sessions,
        start_date: updates.start_date,
        end_date: updates.end_date || null
      })

      const result = response.data

      if (result.success === false) {
        return { success: false, message: result.message || result.error }
      }

      // Update local store
      const updatedSubscription = result.data?.subscription || result.data || result
      const index = subscriptions.value.findIndex(s => s.id === id)
      if (index !== -1) {
        subscriptions.value[index] = updatedSubscription
      }

      return { success: true, data: updatedSubscription }
    } catch (error) {
      if (error.response) {
        return { success: false, message: error.response.data?.message || error.response.data?.error }
      } else if (error.request) {
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const deleteSubscription = async (id) => {
    try {
      const endpoint = `${API_ENDPOINTS.SUBSCRIPTIONS.DELETE}/${id}`
      const response = await axiosInstance.delete(endpoint)

      const result = response.data

      if (result.success === false) {
        return { success: false, message: result.message || result.error }
      }

      // Remove from local store
      const index = subscriptions.value.findIndex(s => s.id === id)
      if (index !== -1) {
        subscriptions.value.splice(index, 1)
      }

      return { success: true }
    } catch (error) {
      if (error.response) {
        return { success: false, message: error.response.data?.message || error.response.data?.error }
      } else if (error.request) {
        return { success: false, message: 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.' }
      } else {
        return { success: false, message: 'Đã có lỗi xảy ra. Vui lòng thử lại.' }
      }
    }
  }

  const getSubscriptionById = (id) => {
    return subscriptions.value.find(s => s.id === id)
  }

  const getSubscriptionsByStudent = (studentId) => {
    return subscriptions.value.filter(s => s.studentId === studentId || s.student_id === studentId)
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
    fetchStudentById,
    loadStudents,
    getStudentClasses,
    // Parents Actions
    addParent,
    updateParent,
    deleteParent,
    // Classes Actions
    addClass,
    loadClasses,
    registerStudentToClass,
    updateClass,
    deleteClass,
    getClassById,
    // Subscriptions Actions
    loadSubscriptions,
    addSubscription,
    fetchSubscriptionById,
    updateSubscription,
    useSession,
    deleteSubscription,
    getSubscriptionById,
    getSubscriptionsByStudent
  }
})

