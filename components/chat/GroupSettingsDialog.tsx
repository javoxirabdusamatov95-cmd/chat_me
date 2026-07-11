"use client"

import { useEffect, useState } from "react"
import { MoreHorizontal, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { InviteModal } from "./InviteModal"
import type { GroupDetailResponse, GroupMemberResponse } from "@/types"

interface GroupSettingsDialogProps {
  groupId: number
  detail: GroupDetailResponse | null
  members: GroupMemberResponse[]
  onLeave: () => Promise<void>
  onDelete?: () => Promise<void>
  canDelete?: boolean
  open?: boolean
  onOpenChange?: (open: boolean) => void
  initialTab?: "general" | "members" | "invite"
}

export function GroupSettingsDialog({
  groupId,
  detail,
  members,
  onLeave,
  onDelete,
  canDelete = false,
  open,
  onOpenChange,
  initialTab = "general",
}: GroupSettingsDialogProps) {
  const [tab, setTab] = useState<"general" | "members" | "invite">(initialTab)
  const [isLeaving, setIsLeaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const handleLeave = async () => {
    setIsLeaving(true)
    try {
      await onLeave()
    } finally {
      setIsLeaving(false)
    }
  }

  const handleDelete = async () => {
    if (!onDelete) return
    const confirmed = confirm("Guruhni o'chirishni tasdiqlaysizmi? Bu amalni qaytarib bo'lmaydi.")
    if (!confirmed) return

    setIsDeleting(true)
    try {
      await onDelete()
    } finally {
      setIsDeleting(false)
    }
  }

  useEffect(() => {
    if (open) {
      setTab(initialTab)
    }
  }, [open, initialTab])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-xl text-muted-foreground hover:bg-accent"
          aria-label="Guruh sozlamalari"
        >
          <MoreHorizontal size={18} />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle>Guruh sozlamalari</DialogTitle>
              <p className="text-sm text-muted-foreground">
                {detail?.name ? `"${detail.name}" uchun` : "Guruh sozlamalari"}
              </p>
            </div>
            <DialogClose asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <ArrowRight className="rotate-180" size={18} />
              </Button>
            </DialogClose>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {[
            { id: "general", label: "Umumiy" },
            { id: "members", label: "A'zolar" },
            { id: "invite", label: "Taklif" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id as "general" | "members" | "invite")}
              className={`rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                tab === item.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-accent"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {tab === "general" && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-sm text-muted-foreground">Guruh nomi</p>
                <p className="mt-1 text-base font-semibold">{detail?.name || "Noma'lum guruh"}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {detail?.description || "Bu guruh uchun tavsif mavjud emas."}
                </p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm text-muted-foreground">A'zolar soni</p>
                    <p className="mt-1 text-base font-semibold">{members.length}</p>
                  </div>
                  <Users className="h-5 w-5 text-muted-foreground" />
                </div>
              </div>
              <div className="flex justify-end">
                {canDelete ? (
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? "O'chirilmoqda..." : "Guruhni o'chirish"}
                </Button>
              ) : (
                <Button
                  variant="destructive"
                  onClick={handleLeave}
                  disabled={isLeaving}
                >
                  {isLeaving ? "Ketmoqda..." : "Guruhni tark etish"}
                </Button>
              )}
              </div>
            </div>
          )}

          {tab === "members" && (
            <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
              {members.length === 0 ? (
                <p className="text-sm text-muted-foreground">A'zolar topilmadi.</p>
              ) : (
                members.map((member) => (
                  <div
                    key={member.user_id}
                    className="flex items-center justify-between gap-4 rounded-xl border border-border/50 bg-background/80 px-3 py-3"
                  >
                    <div>
                      <p className="font-semibold">{member.user.username}</p>
                      <p className="text-sm text-muted-foreground">@{member.user.username}</p>
                    </div>
                    <span className="rounded-full bg-muted/20 px-3 py-1 text-xs font-semibold text-muted-foreground">
                      {member.role}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === "invite" && (
            <div className="space-y-4 rounded-2xl border border-border bg-card p-4">
              <p className="text-sm text-muted-foreground">
                Guruhga yangi a'zolarni taklif qiling.
              </p>
              <InviteModal groupId={groupId} />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
