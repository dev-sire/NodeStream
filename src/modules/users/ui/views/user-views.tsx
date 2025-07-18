interface UserViewProps {
  userId: string;
}

export const UserView = ({ userId }: UserViewProps) => {
  return(
    <div className="text-lg font-medium text-rose-500">{userId}</div>
  )
}