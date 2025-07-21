import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "@/trpc/routers/_app";

export type UsersGetOneOutput = inferRouterOutputs<AppRouter>["users"]["getOne"]