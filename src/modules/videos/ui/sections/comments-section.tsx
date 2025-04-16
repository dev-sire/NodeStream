"use client"

import { trpc } from "@/trpc/client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

interface CommentsSectionProps {
  videoId: string;
}

export const CommentsSection = ({ videoId }: CommentsSectionProps) => {
  return(
    <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <CommentsSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  )
}

const CommentsSectionSuspense = ({ videoId }: CommentsSectionProps) => {

  const [comments] = trpc.comments.getMany.useSuspenseQuery({ videoId })

  return (
    <div>
      {JSON.stringify(comments)}
    </div>
  )
}