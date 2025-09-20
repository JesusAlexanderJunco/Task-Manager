import { z } from 'zod'

// Task-related 
export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  dueDate: z.date().optional(),
  assigneeId: z.string(),
})

export const updateTaskSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(100).optional(),
  description: z.string().optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
  dueDate: z.date().optional(),
  assigneeId: z.string().optional(),
})

export const deleteTaskSchema = z.object({
  id: z.string(),
})

export const getTaskByIdSchema = z.object({
  id: z.string(),
})

// User-related 
export const createUserSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50),
  email: z.string().email('Invalid email address'),
})

// Comment-related
export const createCommentSchema = z.object({
  content: z.string().min(1, 'Comment cannot be empty').max(500),
  taskId: z.string(),
  // authorId is now set automatically from authenticated user
})

export const getCommentByTaskSchema = z.object({
  taskId: z.string()
})

// Filter schemas
export const getTasksSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  assigneeId: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
})