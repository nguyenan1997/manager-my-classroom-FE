import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // Authentication
  const currentUser = ref(null)
  const userRole = ref(null) // 'manager' or 'parent'
  
  // Managers (for demo, stored in memory)
  const managers = ref([
    // Default manager for testing
    {
      id: '1',
      name: 'Admin',
      email: 'admin@example.com',
      phone: '0123456789',
      password: 'admin123', // In real app, this should be hashed
      createdAt: new Date().toISOString()
    }
  ])
  
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
  const registerManager = (managerData) => {
    // Check if email or phone already exists
    const existingManager = managers.value.find(
      m => m.email === managerData.email || m.phone === managerData.phone
    )
    
    if (existingManager) {
      return false
    }

    const newManager = {
      id: Date.now().toString(),
      ...managerData,
      createdAt: new Date().toISOString()
    }
    managers.value.push(newManager)
    
    // Auto login after registration
    currentUser.value = {
      id: newManager.id,
      name: newManager.name,
      email: newManager.email,
      role: 'manager'
    }
    userRole.value = 'manager'
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
    localStorage.setItem('userRole', userRole.value)
    
    return true
  }

  const loginManager = (credentials) => {
    const manager = managers.value.find(
      m => m.email === credentials.email && m.password === credentials.password
    )
    
    if (!manager) {
      return false
    }

    currentUser.value = {
      id: manager.id,
      name: manager.name,
      email: manager.email,
      role: 'manager'
    }
    userRole.value = 'manager'
    
    // Save to localStorage
    localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
    localStorage.setItem('userRole', userRole.value)
    
    return true
  }

  const registerParent = async (parentData) => {
    try {
      // Call API to register parent
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/parents/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: parentData.name,
          email: parentData.email,
          phone: parentData.phone,
          password: parentData.password
        })
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      
      // Auto login after registration
      currentUser.value = {
        id: data.id,
        name: data.name || 'Phụ huynh',
        phone: data.phone,
        email: data.email,
        role: 'parent',
        studentId: data.studentId || null,
        studentName: null
      }
      userRole.value = 'parent'
      
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
      localStorage.setItem('userRole', userRole.value)
      
      return true
    } catch (error) {
      console.error('Register parent error:', error)
      // Fallback for demo: check if email or phone already exists
      const existingParent = parents.value.find(
        p => p.email === parentData.email || p.phone === parentData.phone
      )
      
      if (existingParent) {
        return false
      }

      // Create new parent locally (for demo)
      const newParent = {
        id: Date.now().toString(),
        name: parentData.name,
        email: parentData.email,
        phone: parentData.phone,
        password: parentData.password, // In real app, this should be hashed
        createdAt: new Date().toISOString()
      }
      parents.value.push(newParent)
      
      // Auto login after registration
      currentUser.value = {
        id: newParent.id,
        name: newParent.name,
        phone: newParent.phone,
        email: newParent.email,
        role: 'parent',
        studentId: null,
        studentName: null
      }
      userRole.value = 'parent'
      
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
      localStorage.setItem('userRole', userRole.value)
      
      return true
    }
  }

  const loginParent = async (credentials) => {
    try {
      // Call API to login parent
      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/parents/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: credentials.identifier, // email or phone
          password: credentials.password
        })
      })

      if (!response.ok) {
        return false
      }

      const data = await response.json()
      
      // Get student info if available
      const student = students.value.find(s => 
        s.parentPhone === data.phone || 
        s.id === data.studentId
      )

      currentUser.value = {
        id: data.id,
        name: data.name || 'Phụ huynh',
        phone: data.phone,
        email: data.email,
        role: 'parent',
        studentId: data.studentId,
        studentName: student ? student.name : null
      }
      userRole.value = 'parent'
      
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
      localStorage.setItem('userRole', userRole.value)
      
      return true
    } catch (error) {
      console.error('Login parent error:', error)
      // Fallback for demo: check local parents array
      const identifier = credentials.identifier.toLowerCase()
      const parent = parents.value.find(p => 
        (p.email && p.email.toLowerCase() === identifier) || 
        p.phone === identifier
      )
      
      if (!parent || !parent.password) {
        return false
      }

      // Simple password check (in real app, this should be hashed)
      if (parent.password !== credentials.password) {
        return false
      }

      // Get student info if available
      const student = students.value.find(s => 
        s.parentPhone === parent.phone || 
        s.id === parent.studentId
      )

      currentUser.value = {
        id: parent.id,
        name: parent.name || 'Phụ huynh',
        phone: parent.phone,
        email: parent.email,
        role: 'parent',
        studentId: parent.studentId,
        studentName: student ? student.name : null
      }
      userRole.value = 'parent'
      
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
      localStorage.setItem('userRole', userRole.value)
      
      return true
    }
  }

  const logout = () => {
    currentUser.value = null
    userRole.value = null
    localStorage.removeItem('currentUser')
    localStorage.removeItem('userRole')
  }

  const checkAuth = () => {
    // Check localStorage for persisted session
    const savedUser = localStorage.getItem('currentUser')
    const savedRole = localStorage.getItem('userRole')
    
    if (savedUser && savedRole) {
      currentUser.value = JSON.parse(savedUser)
      userRole.value = savedRole
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
    managers,
    isAuthenticated,
    isManager,
    isParent,
    // State
    students,
    parents,
    classes,
    subscriptions,
    // Auth Actions
    registerManager,
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

