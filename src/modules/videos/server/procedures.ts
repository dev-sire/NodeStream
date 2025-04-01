import { db } from "@/db";
import { videos, videoUpdateSchema } from "@/db/schema";
import { mux } from "@/lib/mux";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, eq } from "drizzle-orm";
import { UTApi } from "uploadthing/server";
import { z } from "zod";

export const videosRouter = createTRPCRouter({
  restoreThumbnail: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async({ ctx, input }) => {
      const { id: userId } = ctx.user
      const [existingVideo] = await db
        .select()
        .from(videos)
        .where(
          and(
            eq(videos.id, input.id),
            eq(videos.userId, userId)
          )
        )
      
      if(!existingVideo){
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      if(existingVideo.thumbnailKey){
        const utapi = new UTApi()
        await utapi.deleteFiles(existingVideo.thumbnailKey)
        await db
          .update(videos)
          .set({ thumbnailKey: null, thumbnailUrl: null })
          .where(and(
            eq(videos.id, input.id),
            eq(videos.userId, userId)
          ))
      }

      if(!existingVideo.muxPlaybackId){
        throw new TRPCError({ code: "BAD_REQUEST" })
      }

      const tempThumbnailUrl = `https://image.mux.com/${existingVideo.muxPlaybackId}/thumbnail.jpg`;
      const utapi = new UTApi()
      const uploadedThumbnail = await utapi.uploadFilesFromUrl(tempThumbnailUrl)

      if(!uploadedThumbnail.data){
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" })
      }
      
      const{key: thumbnailKey, url: thumbnailUrl} = uploadedThumbnail.data

      const [updatedVideo] = await db
        .update(videos)
        .set({ thumbnailUrl, thumbnailKey })
        .where(and(
          eq(videos.id, input.id),
          eq(videos.userId, userId)
        ))
        .returning()

      return updatedVideo;
    }),
  remove: protectedProcedure
    .input(z.object({ id: z.string().uuid() }))
    .mutation(async({ ctx, input }) => {
      const{ id: userId } = ctx.user;

      const[removedVideo] = await db
        .delete(videos)
        .where(and(
          eq(videos.id, input.id),
          eq(videos.userId, userId)
        ))
        .returning()

      if(!removedVideo){
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      return removedVideo;
    }),
  update: protectedProcedure
    .input(videoUpdateSchema)
    .mutation(async({ ctx, input }) => {
      const { id: userId } = ctx.user;

      if(!input.id){
        throw new TRPCError({ code: "BAD_REQUEST" })
      }

      const [updatedVideo] = await db.update(videos).set({
        title: input.title,
        description: input.description,
        categoryId: input.categoryId,
        visibility: input.visibility,
        updatedAt: new Date()
      })
      .where(and(
        eq(videos.id, input.id),
        eq(videos.userId, userId),
      ))
      .returning()

      if(!updatedVideo){
        throw new TRPCError({ code: "NOT_FOUND" })
      }
      
      return updatedVideo;
    }),
  create: protectedProcedure.mutation(async ({ ctx }) => {
    const { id: userId } = ctx.user

    const upload = await mux.video.uploads.create({
      new_asset_settings: {
        passthrough: userId,
        playback_policy: ["public"],
        video_quality: "basic",
        input: [
          {
            generated_subtitles: [
              {
                language_code: "en",
                name: "English",
              }
            ]
          }
        ],
      },
      cors_origin: "*", //TODO: In production, set to your url
    })

    const [video] = await db.insert(videos).values({
      userId,
      title: "Untitled",
      muxStatus: "waiting",
      muxUploadId: upload.id,
    })
    .returning()
    return{
      video: video,
      url: upload.url,
    }
  }),
})