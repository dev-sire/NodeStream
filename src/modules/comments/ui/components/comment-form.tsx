import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { useUser, useClerk } from "@clerk/nextjs";
import { trpc } from "@/trpc/client";
import { commentInsertSchema } from "@/db/schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

interface CommentFormProps {
  videoId: string;
  onSuccess?: () => void;
}

export const CommentForm = ({
  videoId,
  onSuccess
}: CommentFormProps) => {

  const { user } = useUser()
  const utils = trpc.useUtils()
  const clerk = useClerk()

  const create = trpc.comments.create.useMutation({
    onSuccess: () => {
      utils.comments.getMany.invalidate({ videoId })
      form.reset()
      toast.success("Comment Added")
      onSuccess?.()
    },
    onError: (error) => {
      toast.error("Something went wrong")
      if(error.data?.code === "UNAUTHORIZED"){
        clerk.openSignIn();
      }
    }
  })

  const form = useForm<z.infer<typeof commentInsertSchema>>({
    resolver: zodResolver(commentInsertSchema.omit({ userId: true })),
    defaultValues: {
      videoId,
      value: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof commentInsertSchema>) => {
    create.mutate(values)
  }

  return(
    <Form {...form}>
      <form 
        className="flex gap-4 group"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <UserAvatar 
          size="lg"
          imageUrl={user?.imageUrl || "/user-placeholder.svg"}
          name={user?.fullName || "User"}
        />
        <div className="flex-1">
          <FormField 
            name="value"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder="Add a comment..."
                    className="resize-none bg-transparent overflow-hidden min-h-0"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="justify-end gap-2 mt-2 flex">
            <Button
              disabled={create.isPending}
              type="submit"
              size="sm"
            >
              Comment
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}