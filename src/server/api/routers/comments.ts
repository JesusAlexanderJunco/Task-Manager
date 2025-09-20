import { createTRPCRouter, protectedProcedure, adminProcedure } from '@/server/api/trpc'
import { createCommentSchema, getCommentByTaskSchema } from '@/lib/validations'

export const commentsRouter = createTRPCRouter({
    getByTaskId: protectedProcedure
        .input(getCommentByTaskSchema)
        .query(async ({ ctx, input }) => {

            const comments = await ctx.prisma.comment.findMany({
                where: {
                    taskId: input.taskId
                }, include: {
                    author: true
                }
            })
            return comments
        }),

    // Only admins can create comments
    create: adminProcedure
        .input(createCommentSchema)
        .mutation(async ({ ctx, input }) => {
            const comment = await ctx.prisma.comment.create({
                data: {
                    content: input.content,
                    taskId: input.taskId,
                    authorId: ctx.user.id, // Use authenticated user's ID
                }, include:{
                    author: true
                }
            })
            return comment
        }),
})
