import { DEFAULT_LIMIT } from "@/constants";
import { UserView } from "@/modules/users/ui/views/user-views";
import { HydrateClient, trpc } from "@/trpc/server";

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

const Page = async ({ params }: PageProps) => {

  const{ userId } = await params;
  void trpc.users.getOne.prefetch({ id: userId })
  void trpc.videos.getMany.prefetchInfinite({ userId, limit: DEFAULT_LIMIT })

  return(
    <HydrateClient>
      <UserView userId={userId} />
    </HydrateClient>
  )
}

export default Page;