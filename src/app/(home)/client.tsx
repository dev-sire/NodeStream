"use client"

import { trpc } from "@/trpc/client"

export const PageClient = () => {

  const [data] = trpc.hello.useSuspenseQuery({ text: "Aman" })

  return (
    <div className="">Page Client Says: {data.greeting}</div>
  )
}