import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getInitials, getAvatarColor, cn } from "@/lib/utils"

interface UserAvatarProps {
  username: string
  avatar?: string | null
  id?: number
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeMap = {
  sm: "h-7 w-7 text-[10px]",
  md: "h-9 w-9 text-xs",
  lg: "h-12 w-12 text-sm",
}

export function UserAvatar({ username, avatar, id = 0, size = "md", className }: UserAvatarProps) {
  return (
    <Avatar className={cn(sizeMap[size], className)}>
      {avatar && <AvatarImage src={avatar} alt={username} />}
      <AvatarFallback className={cn(getAvatarColor(id), "text-white font-semibold")}>
        {getInitials(username)}
      </AvatarFallback>
    </Avatar>
  )
}
