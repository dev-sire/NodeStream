import { VideoView } from "@/modules/videos/ui/views/video-view";
import { HydrateClient, trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{
    videoId: string;
  }>;
}

const Page = async({ params }: PageProps) => {

  const { videoId } = await params
  void trpc.videos.getOne.prefetch({ id: videoId })

  // TODO: Don't forget to change this to prefetchInfinite in production.
  void trpc.comments.getMany.prefetch({ videoId: videoId })

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  )
}

export default Page;