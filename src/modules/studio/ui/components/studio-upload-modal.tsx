"use client"
import { ResponsiveModal } from "@/components/responsive-modal"
import { Button } from "@/components/ui/button"
import { trpc } from "@/trpc/client"
import { Loader2Icon, PlusIcon } from "lucide-react"
import { toast } from "sonner"

export const StudioUploadModal = () => {

  const utils = trpc.useUtils()
  const create = trpc.videos.create.useMutation({
    onSuccess: () => {
      toast.success("Video created")
      utils.studio.getMany.invalidate()
    },
    onError: (error) => {
      toast.error(error.message)
    }
  })

  return (
    <>
      <ResponsiveModal
        title="Upload a video"
        open={!!create.data}
        onOpenChange={() => create.reset()}
      >
        <p>This will be an uploader</p>
      </ResponsiveModal>
      <Button variant="secondary" onClick={() => create.mutate()} disabled={create.isPending}>
        {create.isPending ? <Loader2Icon className="animate-spin" /> : <PlusIcon />}
        Create
      </Button>
    </>
  )
}