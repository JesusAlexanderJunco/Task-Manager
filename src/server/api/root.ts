import { createCallerFactory, createTRPCRouter } from '@/server/api/trpc'
import { tasksRouter } from '@/server/api/routers/tasks'
import { usersRouter } from '@/server/api/routers/users'
import { commentsRouter } from '@/server/api/routers/comments'

export const appRouter = createTRPCRouter({
  tasks: tasksRouter,
  users: usersRouter,
  comments: commentsRouter,
})

export type AppRouter = typeof appRouter

export const createCaller = createCallerFactory(appRouter)