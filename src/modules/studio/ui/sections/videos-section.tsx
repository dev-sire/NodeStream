"use client"
import { DEFAULT_LIMIT } from "@/constants"
import { trpc } from "@/trpc/client"

export const VideosSection = () => {

  const [data] = trpc.studio.getMany.useSuspenseInfiniteQuery({
    limit: DEFAULT_LIMIT,
  },{
    getNextPageParam: (lastPage) => lastPage.nextCursor
  })  

  return (
    <div>
      {JSON.stringify(data)}
    </div>
  )
}