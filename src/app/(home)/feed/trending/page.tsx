import { DEFAULT_LIMIT } from "@/constants";
import { TrendingView } from "@/modules/home/ui/views/trending-view";
import { HydrateClient, trpc } from "@/trpc/server";
export const dynamic = "force-dynamic"

const Page = async () => {

  void trpc.videos.getManyTrending.prefetchInfinite({ limit: DEFAULT_LIMIT })

  return (
    <HydrateClient>
      <TrendingView />
    </HydrateClient> 
  );
}

export default Page;
