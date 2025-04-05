import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"

export const VideoReactions = () => {

  const viewerReaction: "like" | "dislike" = 'like'; // Mock Data for now

  return (
    <div className="flex items-center flex-none">
      <Button
        variant="secondary"
        className="rounded-l-full rounded-r-none gap-2 pr-4"
      >
        <ThumbsUpIcon className={cn("size-5", viewerReaction === 'like' && "fill-black")} />
        102k
      </Button>
      <Separator orientation="vertical" className="h-7" />
      <Button
        variant="secondary"
        className="rounded-l-none rounded-r-full pl-3"
      >
        <ThumbsDownIcon className={cn("size-5", viewerReaction !== 'like' && "fill-black")} />
        {0}
      </Button>
    </div>
  )
}