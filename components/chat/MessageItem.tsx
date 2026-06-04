"use client"
import { useState } from "react"
import { Trash2 } from "lucide-react"
import { UserAvatar } from "@/components/shared/UserAvatar"
import { Button } from "@/components/ui/button"
import { formatTime } from "@/lib/utils"
import { useChatStore } from "@/store/chatStore"
import { useAuthStore } from "@/store/authStore"
import type { MessageResponse } from "@/types"
import { cn } from "@/lib/utils"

interface MessageItemProps {
  message: MessageResponse
  groupId: number
  isAdmin?: boolean
}

export function MessageItem({ message, groupId, isAdmin }: MessageItemProps) {
  const { user } = useAuthStore()
  const { deleteMessage } = useChatStore()
  const [isDeleting, setIsDeleting] = useState(false)
  const [hovered, setHovered] = useState(false)

  const isOwn = user?.id === message.sender_id
  const canDelete = isOwn || isAdmin

  const handleDelete = async () => {
    if (!confirm("Xabarni o'chirmoqchimisiz?")) return
    setIsDeleting(true)
    try {
      await deleteMessage(groupId, message.id)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div
      className={cn("flex gap-2.5 group", isOwn ? "flex-row-reverse" : "flex-row")}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!isOwn && (
        <UserAvatar
          username={message.sender.username}
          avatar={message.sender.avatar}
          id={message.sender.id}
          size="sm"
          className="mt-1 shrink-0"
        />
      )}
      <div className={cn("max-w-[70%] flex flex-col gap-1", isOwn ? "items-end" : "items-start")}>
        {!isOwn && (
          <span className="text-xs font-medium text-muted-foreground px-1">
            {message.sender.username}
          </span>
        )}
        <div className={cn(
          "relative rounded-2xl px-4 py-2.5 text-sm shadow-sm",
          isOwn
            ? "bg-primary text-primary-foreground rounded-tr-sm"
            : "bg-muted text-foreground rounded-tl-sm"
        )}>
          <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>
          <p className={cn(
            "text-[10px] mt-1 select-none",
            isOwn ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-right"
          )}>
            {formatTime(message.created_at)}
          </p>
          {canDelete && hovered && (
            <Button
              size="icon"
              variant="ghost"
              className={cn(
                "absolute top-1 h-6 w-6 opacity-80 hover:opacity-100 hover:bg-destructive/20 hover:text-destructive",
                isOwn ? "right-full mr-1" : "left-full ml-1"
              )}
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
