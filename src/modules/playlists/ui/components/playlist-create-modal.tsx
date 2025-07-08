import { ResponsiveModal } from "@/components/responsive-modal";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { trpc } from "@/trpc/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface PlaylistCreateModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().min(1),
});

export const PlaylistCreateModal = ({
  open,
  onOpenChange,
}: PlaylistCreateModalProps) => {

  const utils = trpc.useUtils()
  const create = trpc.playlists.create.useMutation({
    onSuccess: () => {
      toast.success("Playlists Created");
      utils.playlists.getMany.invalidate()
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast.error("Something went wrong!");
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    create.mutate(values);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  return (
    <ResponsiveModal
      title="Create a playlist"
      open={open}
      onOpenChange={onOpenChange}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Prompt</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="Learning Material..."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={create.isPending}>
              Create
            </Button>
          </div>
        </form>
      </Form>
    </ResponsiveModal>
  );
};