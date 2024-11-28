import { create } from 'zustand'
import { User, Course, Task, Announcement } from '../types'

interface AppState {
  // Auth State
  currentUser: User | null
  setCurrentUser: (user: User | null) => void
  
  // Course State
  courses: Course[]
  setCourses: (courses: Course[]) => void
  addCourse: (course: Course) => void
  updateCourse: (courseId: string, updates: Partial<Course>) => void
  
  // Task State
  tasks: Task[]
  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTaskStatus: (taskId: string, status: Task['status']) => void
  
  // Announcements State
  announcements: Announcement[]
  setAnnouncements: (announcements: Announcement[]) => void
  addAnnouncement: (announcement: Announcement) => void
}

export const useAppStore = create<AppState>((set) => ({
  // Auth State
  currentUser: null,
  setCurrentUser: (user) => set({ currentUser: user }),
  
  // Course State
  courses: [],
  setCourses: (courses) => set({ courses }),
  addCourse: (course) => set((state) => ({ 
    courses: [...state.courses, course] 
  })),
  updateCourse: (courseId, updates) => set((state) => ({
    courses: state.courses.map(course => 
      course.id === courseId ? { ...course, ...updates } : course
    )
  })),
  
  // Task State
  tasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ 
    tasks: [...state.tasks, task] 
  })),
  updateTaskStatus: (taskId, status) => set((state) => ({
    tasks: state.tasks.map(task =>
      task.id === taskId ? { ...task, status } : task
    )
  })),
  
  // Announcements State
  announcements: [],
  setAnnouncements: (announcements) => set({ announcements }),
  addAnnouncement: (announcement) => set((state) => ({ 
    announcements: [...state.announcements, announcement] 
  }))
}))
