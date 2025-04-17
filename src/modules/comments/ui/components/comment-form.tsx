import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { UserAvatar } from "@/components/user-avatar";
import { useUser, useClerk } from "@clerk/nextjs";
import { trpc } from "@/trpc/client";
import { commentInsertSchema } from "@/db/schema";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

interface CommentFormProps {
  videoId: string;
  onSuccess?: () => void;
}

export const CommentForm = ({
  videoId,
  onSuccess
}: CommentFormProps) => {

  const { user } = useUser()

  const create = trpc.comments.create.useMutation()

  const form = useForm<z.infer<typeof commentInsertSchema>>({
    resolver: zodResolver(commentInsertSchema.omit({ userId: true })),
    defaultValues: {
      videoId,
      value: "", 
    }
  })

  const handleSubmit = (values: z.infer<typeof commentInsertSchema>) => {
    create.mutate(values)
  }

  return(
    <form className="flex gap-4 group">
      <UserAvatar 
        size="lg"
        imageUrl={"/user-placeholder.svg"}
        name={user?.fullName || "User"}
      />
      <div className="flex-1">
        <Textarea 
          placeholder="Add a comment..."
          className="resize-none bg-transparent overflow-hidden min-h-0"
        />
        <div className="justify-end gap-2 mt-2 flex">
          <Button 
            type="submit"
            size="sm"
          >
            Comment
          </Button>
        </div>
      </div>
    </form>
  )
}