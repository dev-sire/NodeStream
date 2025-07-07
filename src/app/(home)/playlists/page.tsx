import { PlaylistsView } from "@/modules/playlists/ui/views/playlists-view";
import { HydrateClient } from "@/trpc/server";

const Page = async () => {
  return(
    <HydrateClient>
      <PlaylistsView />
    </HydrateClient>
  )
}

export default Page;