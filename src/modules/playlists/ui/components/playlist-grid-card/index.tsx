import { PlaylistGetManyOutput } from "@/modules/playlists/types";
import Link from "next/link";

interface PlaylistGridCardProps {
  data: PlaylistGetManyOutput["items"][number];
}

export const PlaylistGridCard = ({ data }: PlaylistGridCardProps) => {
  return(
    <Link href={`/playlists/${data.id}`}>
      <div className="flex flex-col gap-2 w-full group">
        {data.name}
        {/* TODO: Continue from here, start by adding thumbnails */}
      </div>
    </Link>
  )
}