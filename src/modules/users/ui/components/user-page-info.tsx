import { UserAvatar } from "@/components/user-avatar";
import { UsersGetOneOutput } from "../../types";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useSubscriptions } from "@/modules/subscriptions/hooks/use-subscriptions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SubscriptionButton } from "@/modules/subscriptions/ui/componenets/subscription-button";

interface UserPageInfoProps {
  user: UsersGetOneOutput;
}

export const UserPageInfo = ({ user }: UserPageInfoProps) => {
  const { userId, isLoaded } = useAuth();
  const clerk = useClerk();
  const { isPending, onClick } = useSubscriptions({
    userId: user.id,
    isSubscribed: user.viewerSubscribed,
  });
  return(
    <div className="py-6">
      {/* Mobile View */}
      <div className="flex flex-col md:hidden">
        <div className="flex items-center gap-3">
          <UserAvatar
            size="lg"
            imageUrl={user.imageUrl}
            name={user.name}
            className="h-[60px] w-[60px]"
            onClick={() => {
              if (user.clerkId === userId) {
                clerk.openUserProfile();
              }
            }}
          />
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold">{user.name}</h1>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
              <span>{user.subscriberCount} subscribers</span>
              <span>&bull;</span>
              <span>{user.videoCount} videos</span>
            </div>
          </div>
        </div>
        {userId === user.clerkId ? (
          <Button
            variant={"secondary"}
            asChild
            className="w-full mt-3 rounded-full"
          >
            <Link prefetch href="/studio">
              Go to Studio
            </Link>
          </Button>
        ) : (
          <SubscriptionButton
            disabled={isPending || !isLoaded}
            isSubscribed={user.viewerSubscribed}
            onClick={onClick}
            className="w-full mt-3"
          />
        )}
      </div>
    </div>
  )
}