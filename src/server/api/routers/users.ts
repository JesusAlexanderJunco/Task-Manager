import { createTRPCRouter, publicProcedure } from '@/server/api/trpc'
import { createUserSchema } from '@/lib/validations'

export const usersRouter = createTRPCRouter({
  // Get all users
  getAll: publicProcedure.query(async ({ ctx }) => {
    const users = await ctx.prisma.user.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return users
  }),

  // Create new user
  create: publicProcedure
    .input(createUserSchema)
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
        },
      })

      return user
    }),
})