import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
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

  return {
    // State
    students,
    parents,
    classes,
    subscriptions,
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

