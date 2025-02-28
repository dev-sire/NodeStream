import { db } from '@/db';
import { users } from '@/db/schema';
import { rateLimit } from '@/lib/ratelimit';
import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { cache } from 'react';
import superjson from "superjson";

export const createTRPCContext = cache(async () => {
  const { userId } = await auth();
  return { clerkUserId: userId };
});

export type Context = Awaited<ReturnType<typeof createTRPCContext>>
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(async function isAuthed(opts){
  const { ctx } = opts
  if(!ctx.clerkUserId){
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, ctx.clerkUserId))
    .limit(1)

  if(!user){
    throw new TRPCError({ code: "UNAUTHORIZED" })
  }

  const { success } = await rateLimit.limit(user.id)

  if(!success){
    throw new TRPCError({ code: "TOO_MANY_REQUESTS" })
  }

  return opts.next({
    ctx: {
      ...ctx,
      user,
    }
  })
})