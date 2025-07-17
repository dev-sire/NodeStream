import { DEFAULT_LIMIT } from "@/constants";
import { LikedView } from "@/modules/playlists/ui/views/liked-view";
import { HydrateClient, trpc } from "@/trpc/server";

export const dynamic = "force-dynamic";

const Page = async () => {
  void trpc.playlists.getLiked.prefetchInfinite({ limit: DEFAULT_LIMIT })

  return (
    <HydrateClient>
      <LikedView />
    </HydrateClient>
  )
}

export default Page;