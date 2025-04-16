import { db } from "@/db";
import { comments } from "@/db/schema";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
        videoId: z.string().uuid(),
        value: z.string()
    }))
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.user
      const { videoId, value } = input

      const[createdComment] = await db
        .insert(comments)
        .values({ userId, videoId, value })
        .returning()

      return createdComment;
    }),
    getMany: baseProcedure
      .input(z.object({
        videoId: z.string().uuid(),
      }))
      .query(async ({ input }) => {
        const { videoId } = input

        const data = await db
          .select()
          .from(comments)
          .where(eq(comments.videoId, videoId))

        return data
      })
})