interface UserViewProps {
  userId: string;
}

export const UserView = ({ userId }: UserViewProps) => {
  return(
    <div className="flex flex-col max-w-[1300px] px-4 pt-2.5 mx-auto gap-y-6">
      {userId}
    </div>
  )
}