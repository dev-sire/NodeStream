import { db } from "@/db";
import { videoReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

export const videoReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.user
      const { videoId } = input

      const[existingVideoReactionsLike] = await db
        .select() 
        .from(videoReactions)
        .where(and(
          eq(videoReactions.videoId, videoId),
          eq(videoReactions.userId, userId),
          eq(videoReactions.type, "like")
        ))
      
      if(existingVideoReactionsLike){
        const [deletedViewerReaction] = await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.videoId, videoId)
            )
          )
          .returning()

          return deletedViewerReaction
      }

      const[createdVideoReaction] = await db
        .insert(videoReactions)
        .values({ userId, videoId, type: "like" })
        .onConflictDoUpdate({
          target: [videoReactions.userId, videoReactions.videoId],
          set: {
            type: "like"
          }
        })
        .returning()

      return createdVideoReaction;
    }),
  dislike: protectedProcedure
    .input(z.object({ videoId: z.string().uuid() }))
    .mutation(async ({ input, ctx }) => {
      const { id: userId } = ctx.user
      const { videoId } = input

      const[existingVideoReactionsDislike] = await db
        .select() 
        .from(videoReactions)
        .where(and(
          eq(videoReactions.videoId, videoId),
          eq(videoReactions.userId, userId),
          eq(videoReactions.type, "dislike")
        ))
      
      if(existingVideoReactionsDislike){
        const [deletedViewerReaction] = await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.userId, userId),
              eq(videoReactions.videoId, videoId)
            )
          )
          .returning()

          return deletedViewerReaction
      }

      const[createdVideoReaction] = await db
        .insert(videoReactions)
        .values({ userId, videoId, type: "dislike" })
        .onConflictDoUpdate({
          target: [videoReactions.userId, videoReactions.videoId],
          set: {
            type: "dislike"
          }
        })
        .returning()

      return createdVideoReaction;
    })
})