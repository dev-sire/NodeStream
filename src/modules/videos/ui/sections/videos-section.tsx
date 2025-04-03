"use client"

import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface VideoSectionProps {
  videoId: string;
}

export const VideoSection = ({ videoId }: VideoSectionProps) => {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <VideoSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  )
}

const VideoSectionSuspense = ({ videoId }: VideoSectionProps) => {

  const [video] = trpc.videos.getOne.useSuspenseQuery({ id: videoId })

  return(
    <div className="mt-2 text-sm font-bold">
      {JSON.stringify(video)}
    </div>
  )
}