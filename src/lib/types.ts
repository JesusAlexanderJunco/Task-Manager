import type { Task, User, Comment, TaskStatus, Priority } from '@prisma/client'

// Enhanced types with relations
export type TaskWithDetails = Task & {
  assignee: User
  comments: (Comment & {
    author: User
  })[]
}

export type UserWithTasks = User & {
  assignedTasks: Task[]
}

// API response types
export type ApiResponse<T> = {
  data: T
  success: boolean
  message?: string
}

// Form types
export type CreateTaskInput = {
  title: string
  description?: string
  priority: Priority
  dueDate?: Date
  assigneeId: string
}

export type UpdateTaskInput = {
  id: string
  title?: string
  description?: string
  status?: TaskStatus
  priority?: Priority
  dueDate?: Date
  assigneeId?: string
}

export type TaskFilters = {
  status?: TaskStatus
  assigneeId?: string
  priority?: Priority
}