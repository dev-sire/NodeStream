import { db } from "@/db";
import { playlists, playlistVideos, users, videoReactions, videos, videoViews } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { TRPCError } from "@trpc/server";
import { and, desc, eq, getTableColumns, lt, or, sql } from "drizzle-orm";
import { z } from "zod";

export const playlistsRouter = createTRPCRouter({
  remove: protectedProcedure.input(
    z.object({
      id: z.string().uuid()
    })
  ).mutation(async({ input, ctx }) => {
    const { id } = input;
    const { id: userId } = ctx.user

    
    const [deletedPlaylist] = await db
    .delete(playlists)
    .where(
      and(
        eq(playlists.id, id),
        eq(playlists.userId, userId)
      )
    )
    .returning()

    if(!deletedPlaylist){
      throw new TRPCError({ code: "NOT_FOUND" })
    }

    return deletedPlaylist;
  }),
  getOne: protectedProcedure.input(
    z.object({
      id: z.string().uuid(),
    })
  ).query(async ({ input, ctx }) => {
    const { id } = input;
    const { id: userId } = ctx.user;

    const [existingPlaylists] = await db
    .select()
    .from(playlists)
    .where(
      and(
        eq(playlists.id, id),
        eq(playlists.userId, userId)
      )
    )

    if(!existingPlaylists){
      throw new TRPCError({ code: "NOT_FOUND" })
    }

    return existingPlaylists;
  }),
  getVideos: protectedProcedure.input(
    z.object({
      playlistId: z.string().uuid(),
      cursor: z
        .object({
          id: z.string().uuid(),
          updatedAt: z.date(),
        })
        .nullish(),
      limit: z.number().min(1).max(100),
    })
  ).query(async ({ input, ctx }) => {

    const { id: userId } = ctx.user
    const { cursor, limit, playlistId } = input;

    const [existingPlaylists] = await db
      .select()
      .from(playlists)
      .where(
        and(
          eq(playlists.id, playlistId),
          eq(playlists.userId, userId)
        )
      )

    if(!existingPlaylists){
      throw new TRPCError({ code: "NOT_FOUND" })
    }

    const videosFromPlaylist = db.$with("playlist_videos").as(
      db
        .select({
          videoId: playlistVideos.videoId,
        })
        .from(playlistVideos)
        .where(eq(playlistVideos.playlistId, playlistId))
    )

    const data = await db
      .with(videosFromPlaylist)
      .select({
        ...getTableColumns(videos),
        user: users,
        viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),

        likeCount: db.$count(
          videoReactions,
          and(
            eq(videoReactions.videoId, videos.id),
            eq(videoReactions.type, "like")
          )
        ),
        dislikeCount: db.$count(
          videoReactions,
          and(
            eq(videoReactions.videoId, videos.id),
            eq(videoReactions.type, "dislike")
          )
        ),
      })
      .from(videos)
      .innerJoin(users, eq(videos.userId, users.id))
      .innerJoin(videosFromPlaylist, eq(videos.id, videosFromPlaylist.videoId))
      .where(
        and(
          eq(videos.visibility, "public"),
          cursor
            ? or(
                lt(videos.updatedAt, cursor.updatedAt),
                and(
                  eq(videos.updatedAt, cursor.updatedAt),
                  lt(videos.id, cursor.id)
                )
              )
            : undefined
        )
      )
      .orderBy(desc(videos.updatedAt), desc(videos.id))
      //add 1 to the limit to check if there is more data
      .limit(limit + 1);
    const hasMore = data.length > limit;
    //remove the last item if there is more data
    const items = hasMore ? data.slice(0, -1) : data;
    //Set the next cursor to the last item if there is more data
    const lastItem = items[items.length - 1];
    const nextCursor = hasMore
      ? {
          id: lastItem.id,
          updatedAt: lastItem.updatedAt,
        }
      : null;
    return {
      items,
      nextCursor,
    };
  }),
  removeVideo: protectedProcedure.input(
    z.object({
      playlistId: z.string().uuid(),
      videoId: z.string().uuid(),
    })).mutation(async ({ ctx, input }) => {

      const { playlistId, videoId } = input
      const { id: userId } = ctx.user

      const[existingPlaylists] = await db
        .select()
        .from(playlists)
        .where(and(
          eq(playlists.id, playlistId),
          eq(playlists.userId, userId)
        ))
      
      if(!existingPlaylists){
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      
      const[existingVideos] = await db
        .select()
        .from(videos)
        .where(eq(videos.id, videoId))

      if(!existingVideos){
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      const[existingPlaylistVideo] = await db
        .select()
        .from(playlistVideos)
        .where(
          and(
            eq(playlistVideos.playlistId, playlistId),
            eq(playlistVideos.videoId, videoId)
          )
        )
      
      if(!existingPlaylistVideo){
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      const[deletedPlaylistVideo] = await db
        .delete(playlistVideos)
        .where(
          and(
            eq(playlistVideos.playlistId, playlistId),
            eq(playlistVideos.videoId, videoId)
          )
        )
        .returning()

      return deletedPlaylistVideo;
    }),
  addVideo: protectedProcedure.input(
    z.object({
      playlistId: z.string().uuid(),
      videoId: z.string().uuid(),
    })).mutation(async ({ ctx, input }) => {

      const { playlistId, videoId } = input
      const { id: userId } = ctx.user

      const[existingPlaylists] = await db
        .select()
        .from(playlists)
        .where(and(
          eq(playlists.id, playlistId),
          eq(playlists.userId, userId)
        ))
      
      if(!existingPlaylists){
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      
      const[existingVideos] = await db
        .select()
        .from(videos)
        .where(eq(videos.id, videoId))

      if(!existingVideos){
        throw new TRPCError({ code: "NOT_FOUND" })
      }

      const[existingPlaylistVideo] = await db
        .select()
        .from(playlistVideos)
        .where(
          and(
            eq(playlistVideos.playlistId, playlistId),
            eq(playlistVideos.videoId, videoId)
          )
        )
      
      if(existingPlaylistVideo){
        throw new TRPCError({ code: "CONFLICT" })
      }

      const[createdPlaylistVideo] = await db
        .insert(playlistVideos)
        .values({ playlistId, videoId })
        .returning()

      return createdPlaylistVideo;
    }),
  getManyForVideo: protectedProcedure.input(
  z.object({
      videoId: z.string().uuid(),
      cursor: z
        .object({
          id: z.string().uuid(),
          updatedAt: z.date(),
        })
        .nullish(),
      limit: z.number().min(1).max(100),
    })
  ).query(async ({ input, ctx }) => {

    const { id: userId } = ctx.user
    const { cursor, limit, videoId } = input;

    const data = await db
      .select({
        ...getTableColumns(playlists),
        videoCount: db.$count(
          playlistVideos,
          eq(playlists.id, playlistVideos.playlistId)
        ),
        user: users,
        containsVideo: videoId
          ? sql<boolean>`(
            SELECT EXISTS (
              SELECT 1
              FROM ${playlistVideos} pv
              WHERE pv.playlist_id = ${playlists.id} AND pv.video_id = ${videoId}
            )
          )`
          : sql<boolean>`false`
      })
      .from(playlists)
      .innerJoin(users, eq(playlists.userId, users.id))
      .where(
        and(
          eq(playlists.userId, userId),
          cursor
            ? or(
                lt(playlists.updatedAt, cursor.updatedAt),
                and(
                  eq(playlists.updatedAt, cursor.updatedAt),
                  lt(playlists.id, cursor.id)
                )
              )
            : undefined
        )
      )
      .orderBy(desc(playlists.updatedAt), desc(playlists.id))
      //add 1 to the limit to check if there is more data
      .limit(limit + 1);
    const hasMore = data.length > limit;
    //remove the last item if there is more data
    const items = hasMore ? data.slice(0, -1) : data;
    //Set the next cursor to the last item if there is more data
    const lastItem = items[items.length - 1];
    const nextCursor = hasMore
      ? {
          id: lastItem.id,
          updatedAt: lastItem.updatedAt,
        }
      : null;
    return {
      items,
      nextCursor,
    };
  }),
  getMany: protectedProcedure.input(
  z.object({
      cursor: z
        .object({
          id: z.string().uuid(),
          updatedAt: z.date(),
        })
        .nullish(),
      limit: z.number().min(1).max(100),
    })
  ).query(async ({ input, ctx }) => {

    const { id: userId } = ctx.user
    const { cursor, limit } = input;

    const data = await db
      .select({
        ...getTableColumns(playlists),
        videoCount: db.$count(
          playlistVideos,
          eq(playlists.id, playlistVideos.playlistId)
        ),
        user: users,
        thumbnailUrl: sql<string | null>`(
          SELECT v.thumbnail_url
          FROM ${playlistVideos} pv
          JOIN ${videos} v ON v.id = pv.video_id
          WHERE pv.playlist_id = ${playlists.id}
          ORDER BY pv.updated_at DESC
          LIMIT 1
        )`
      })
      .from(playlists)
      .innerJoin(users, eq(playlists.userId, users.id))
      .where(
        and(
          eq(playlists.userId, userId),
          cursor
            ? or(
                lt(playlists.updatedAt, cursor.updatedAt),
                and(
                  eq(playlists.updatedAt, cursor.updatedAt),
                  lt(playlists.id, cursor.id)
                )
              )
            : undefined
        )
      )
      .orderBy(desc(playlists.updatedAt), desc(playlists.id))
      //add 1 to the limit to check if there is more data
      .limit(limit + 1);
    const hasMore = data.length > limit;
    //remove the last item if there is more data
    const items = hasMore ? data.slice(0, -1) : data;
    //Set the next cursor to the last item if there is more data
    const lastItem = items[items.length - 1];
    const nextCursor = hasMore
      ? {
          id: lastItem.id,
          updatedAt: lastItem.updatedAt,
        }
      : null;
    return {
      items,
      nextCursor,
    };
  }),
  create: protectedProcedure.input(
    z.object({
      name: z.string().min(1)
    })).mutation(async ({ ctx, input }) => {
      const { name } = input
      const { id: userId } = ctx.user

      const [createdPlaylists] = await db
        .insert(playlists)
        .values({
          userId,
          name
        })
        .returning()

      if(!createdPlaylists){
        throw new TRPCError({ code: "BAD_REQUEST" })
      }

      return createdPlaylists;
    }),
  getLiked: protectedProcedure.input(
    z.object({
      cursor: z
        .object({
          id: z.string().uuid(),
          likedAt: z.date(),
        })
        .nullish(),
      limit: z.number().min(1).max(100),
    })
  ).query(async ({ input, ctx }) => {

    const { id: userId } = ctx.user
    const { cursor, limit } = input;

    const viewerVideoReactions = db.$with("viewer_video_reactions").as(
      db
        .select({
          videoId: videoReactions.videoId,
          likedAt: videoReactions.updatedAt
        })
        .from(videoReactions)
        .where(and(
          eq(videoReactions.userId, userId),
          eq(videoReactions.type, "like")
        ))
    )

    const data = await db
      .with(viewerVideoReactions)
      .select({
        ...getTableColumns(videos),
        user: users,
        likedAt: viewerVideoReactions.likedAt,
        viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),

        likeCount: db.$count(
          videoReactions,
          and(
            eq(videoReactions.videoId, videos.id),
            eq(videoReactions.type, "like")
          )
        ),
        dislikeCount: db.$count(
          videoReactions,
          and(
            eq(videoReactions.videoId, videos.id),
            eq(videoReactions.type, "dislike")
          )
        ),
      })
      .from(videos)
      .innerJoin(users, eq(videos.userId, users.id))
      .innerJoin(viewerVideoReactions, eq(videos.id, viewerVideoReactions.videoId))
      .where(
        and(
          eq(videos.visibility, "public"),
          cursor
            ? or(
                lt(viewerVideoReactions.likedAt, cursor.likedAt),
                and(
                  eq(viewerVideoReactions.likedAt, cursor.likedAt),
                  lt(videos.id, cursor.id)
                )
              )
            : undefined
        )
      )
      .orderBy(desc(viewerVideoReactions.likedAt), desc(videos.id))
      //add 1 to the limit to check if there is more data
      .limit(limit + 1);
    const hasMore = data.length > limit;
    //remove the last item if there is more data
    const items = hasMore ? data.slice(0, -1) : data;
    //Set the next cursor to the last item if there is more data
    const lastItem = items[items.length - 1];
    const nextCursor = hasMore
      ? {
          id: lastItem.id,
          likedAt: lastItem.likedAt,
        }
      : null;
    return {
      items,
      nextCursor,
    };
  }),
  getHistory: protectedProcedure.input(
    z.object({
      cursor: z
        .object({
          id: z.string().uuid(),
          viewedAt: z.date(),
        })
        .nullish(),
      limit: z.number().min(1).max(100),
    })
  ).query(async ({ input, ctx }) => {

    const { id: userId } = ctx.user
    const { cursor, limit } = input;

    const viewerVideoViews = db.$with("viewer_video_views").as(
      db
        .select({
          videoId: videoViews.videoId,
          viewedAt: videoViews.updatedAt
        })
        .from(videoViews)
        .where(eq(videoViews.userId, userId))
    )

    const data = await db
      .with(viewerVideoViews)
      .select({
        ...getTableColumns(videos),
        user: users,
        viewedAt: viewerVideoViews.viewedAt,
        viewCount: db.$count(videoViews, eq(videoViews.videoId, videos.id)),

        likeCount: db.$count(
          videoReactions,
          and(
            eq(videoReactions.videoId, videos.id),
            eq(videoReactions.type, "like")
          )
        ),
        dislikeCount: db.$count(
          videoReactions,
          and(
            eq(videoReactions.videoId, videos.id),
            eq(videoReactions.type, "dislike")
          )
        ),
      })
      .from(videos)
      .innerJoin(users, eq(videos.userId, users.id))
      .innerJoin(viewerVideoViews, eq(videos.id, viewerVideoViews.videoId))
      .where(
        and(
          eq(videos.visibility, "public"),
          cursor
            ? or(
                lt(viewerVideoViews.viewedAt, cursor.viewedAt),
                and(
                  eq(viewerVideoViews.viewedAt, cursor.viewedAt),
                  lt(videos.id, cursor.id)
                )
              )
            : undefined
        )
      )
      .orderBy(desc(viewerVideoViews.viewedAt), desc(videos.id))
      //add 1 to the limit to check if there is more data
      .limit(limit + 1);
    const hasMore = data.length > limit;
    //remove the last item if there is more data
    const items = hasMore ? data.slice(0, -1) : data;
    //Set the next cursor to the last item if there is more data
    const lastItem = items[items.length - 1];
    const nextCursor = hasMore
      ? {
          id: lastItem.id,
          viewedAt: lastItem.viewedAt,
        }
      : null;
    return {
      items,
      nextCursor,
    };
  }),
})