import { HydrateClient, trpc } from "@/trpc/server";
import { PageClient } from "./client";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default async function Home() {

  void await trpc.hello.prefetch({ text: "Aman" })

  return (
    <HydrateClient>
      <Suspense fallback={<p>Loading...</p>}>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <PageClient />
      </ErrorBoundary>
      </Suspense>
    </HydrateClient> 
  );
}
