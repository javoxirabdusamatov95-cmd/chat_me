"use client"
import { useEffect, useRef, useState, useCallback } from "react"
import { Users, Settings, Trash2, LogOut, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageItem } from "./MessageItem"
import { MessageInput } from "./MessageInput"
import { InviteModal } from "./InviteModal"
import { useChatStore } from "@/store/chatStore"
import { useAuthStore } from "@/store/authStore"
import { groupsApi } from "@/lib/api"
import type { GroupDetailResponse, GroupMemberResponse } from "@/types"
import { getAvatarColor, getInitials, cn } from "@/lib/utils"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog"
import { UserAvatar } from "@/components/shared/UserAvatar"

interface ChatAreaProps {
  groupId: number
}

export function ChatArea({ groupId }: ChatAreaProps) {
  const router = useRouter()
  const { user } = useAuthStore()
  const { messages, fetchMessages, pollMessages, setActiveGroup, removeGroup } = useChatStore()
  const [groupDetail, setGroupDetail] = useState<GroupDetailResponse | null>(null)
  const [members, setMembers] = useState<GroupMemberResponse[]>([])
  const [showMembers, setShowMembers] = useState(false)
  const [isLoadingDetail, setIsLoadingDetail] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const groupMessages = messages[groupId] || []
  const myRole = members.find(m => m.user_id === user?.id)?.role
  const isAdmin = myRole === "admin"

  const loadGroup = useCallback(async () => {
    setIsLoadingDetail(true)
    try {
      const [detail, memberList] = await Promise.all([
        groupsApi.get(groupId),
        groupsApi.getMembers(groupId),
      ])
      setGroupDetail(detail)
      setMembers(memberList)
    } catch {
      router.push("/chat")
    } finally {
      setIsLoadingDetail(false)
    }
  }, [groupId, router])

  useEffect(() => {
    setActiveGroup(groupId)
    loadGroup()
    fetchMessages(groupId)

    intervalRef.current = setInterval(() => {
      pollMessages(groupId)
    }, 3000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
      setActiveGroup(null)
    }
  }, [groupId, loadGroup, fetchMessages, pollMessages, setActiveGroup])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [groupMessages])

  const handleLeave = async () => {
    if (!confirm("Guruhdan chiqmoqchimisiz?")) return
    await groupsApi.leave(groupId)
    removeGroup(groupId)
    router.push("/chat")
  }

  const handleDelete = async () => {
    if (!confirm("Guruhni o'chirmoqchimisiz? Bu amal qaytarib bo'lmaydi.")) return
    await groupsApi.delete(groupId)
    removeGroup(groupId)
    router.push("/chat")
  }

  const handleKick = async (userId: number) => {
    if (!confirm("Bu a'zoni chiqarishni tasdiqlaysizmi?")) return
    await groupsApi.kickMember(groupId, userId)
    setMembers(prev => prev.filter(m => m.user_id !== userId))
  }

  if (isLoadingDetail) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0">
        <div className={cn(
          "h-10 w-10 rounded-xl flex items-center justify-center text-white text-sm font-bold shrink-0",
          getAvatarColor(groupId)
        )}>
          {groupDetail?.name ? getInitials(groupDetail.name) : "?"}
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="font-semibold text-sm truncate">{groupDetail?.name}</h2>
          <p className="text-xs text-muted-foreground">
            {groupDetail?.member_count} a&apos;zo
            {groupDetail?.description && ` • ${groupDetail.description}`}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <InviteModal groupId={groupId} />
          <Button
            size="sm"
            variant="ghost"
            className="gap-1.5 text-xs h-7"
            onClick={() => setShowMembers(true)}
          >
            <Users className="h-3.5 w-3.5" /> A&apos;zolar
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel className="text-xs">Guruh sozlamalari</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLeave} className="text-orange-500 focus:text-orange-500 cursor-pointer">
                <LogOut className="h-4 w-4" /> Guruhdan chiqish
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem onClick={handleDelete} className="text-destructive focus:text-destructive cursor-pointer">
                  <Trash2 className="h-4 w-4" /> Guruhni o&apos;chirish
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
      >
        {groupMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className={cn(
              "h-16 w-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold mb-4",
              getAvatarColor(groupId)
            )}>
              {groupDetail?.name ? getInitials(groupDetail.name) : "?"}
            </div>
            <h3 className="font-semibold text-lg">{groupDetail?.name}</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Bu guruhning boshlanishi. Birinchi xabarni yuboring!
            </p>
          </div>
        ) : (
          groupMessages.map((msg) => (
            <MessageItem
              key={msg.id}
              message={msg}
              groupId={groupId}
              isAdmin={isAdmin}
            />
          ))
        )}
      </div>

      {/* Input */}
      <MessageInput groupId={groupId} />

      {/* Members Dialog */}
      <Dialog open={showMembers} onOpenChange={setShowMembers}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Guruh a&apos;zolari ({members.length})</DialogTitle>
          </DialogHeader>
          <div className="space-y-1 max-h-[400px] overflow-y-auto">
            {members.map((member) => (
              <div key={member.id} className="flex items-center gap-3 rounded-lg p-2 hover:bg-accent">
                <UserAvatar
                  username={member.user.username}
                  avatar={member.user.avatar}
                  id={member.user.id}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{member.user.username}</p>
                </div>
                <Badge variant={member.role === "admin" ? "default" : "secondary"} className="text-[10px]">
                  {member.role === "admin" ? "Admin" : "A'zo"}
                </Badge>
                {isAdmin && member.user_id !== user?.id && (
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleKick(member.user_id)}
                  >
                    <LogOut className="h-3 w-3" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
