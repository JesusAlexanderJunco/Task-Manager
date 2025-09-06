import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import {
  createTaskSchema,
  updateTaskSchema,
  deleteTaskSchema,
  getTaskByIdSchema,
  getTasksSchema,
} from '@/lib/validations'

export const tasksRouter = createTRPCRouter({
  // Get all tasks with optional filtering
  getAll: publicProcedure
    .input(getTasksSchema)
    .query(async ({ ctx, input }) => {
      const { status, assigneeId, priority } = input

      const tasks = await ctx.prisma.task.findMany({
        where: {
          ...(status && { status }),
          ...(assigneeId && { assigneeId }),
          ...(priority && { priority }),
        },
        include: {
          assignee: true,
          comments: {
            include: {
              author: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      })

      return tasks
    }),

  // Get task by ID
  getById: publicProcedure
    .input(getTaskByIdSchema)
    .query(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findUnique({
        where: { id: input.id },
        include: {
          assignee: true,
          comments: {
            include: {
              author: true,
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      })

      if (!task) {
        throw new Error('Task not found')
      }

      return task
    }),

  // Create new task
  create: publicProcedure
    .input(createTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.create({
        data: {
          title: input.title,
          description: input.description,
          priority: input.priority,
          dueDate: input.dueDate,
          assigneeId: input.assigneeId,
        },
        include: {
          assignee: true,
          comments: {
            include: {
              author: true,
            },
          },
        },
      })

      return task
    }),

  // Update existing task
  update: publicProcedure
    .input(updateTaskSchema)
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input

      const task = await ctx.prisma.task.update({
        where: { id },
        data: updateData,
        include: {
          assignee: true,
          comments: {
            include: {
              author: true,
            },
          },
        },
      })

      return task
    }),

  // Delete task
  delete: publicProcedure
    .input(deleteTaskSchema)
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.task.delete({
        where: { id: input.id },
      })

      return { success: true }
    }),
})