import { useAuth } from "@clerk/nextjs";
import { UsersGetOneOutput } from "../../types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Edit2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { BannerUploadModal } from "./banner-upload-modal";

interface UserPageBannerProps {
  user: UsersGetOneOutput;
}
export const UserPageBannerSkeleton = () => {
  return <Skeleton className="w-full max-h-[200px] h-[15vh] md:h-[25vh]" />;
};
export const UserPageBanner = ({ user }: UserPageBannerProps) => {
  const { userId } = useAuth();
  const [isBannerUploadModalOpen, setIsBannerUploadModalOpen] = useState(false);
  return (
    <div className="relative group">
      <BannerUploadModal
        userId={user.id}
        open={isBannerUploadModalOpen}
        onOpenChange={setIsBannerUploadModalOpen}
      />
      <div
        className={cn(
          "w-full max-h-[200px] h-[25vh] bg-gradient-to-r from-bg-gray-100 to-bg-gray-300 rounded-xl",
          user.bannerUrl ? "bg-cover bg-center" : "bg-gray-300"
        )}
        style={{
          backgroundImage: user.bannerUrl
            ? `url(${user.bannerUrl})`
            : undefined,
        }}
      >
        {user.clerkId === userId && (
          <Button
            type="button"
            size="icon"
            className="absolute top-4 right-4 rounded-full bg-black/50 hover:bg-black/50 opacity-100
            md:opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            onClick={() => setIsBannerUploadModalOpen(true)}
          >
            <Edit2Icon className="size-4 text-white" />
          </Button>
        )}
      </div>
    </div>
  );
};