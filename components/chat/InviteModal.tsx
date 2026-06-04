"use client"
import { useState } from "react"
import { UserPlus, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { groupsApi } from "@/lib/api"

interface InviteModalProps {
  groupId: number
}

export function InviteModal({ groupId }: InviteModalProps) {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return
    setIsLoading(true)
    setError("")
    setSuccess("")
    try {
      await groupsApi.invite(groupId, { username: username.trim() })
      setSuccess(`${username} ga taklif yuborildi!`)
      setUsername("")
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg || "Taklif yuborishda xato")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o) => { setOpen(o); setError(""); setSuccess(""); }}>
      <DialogTrigger asChild>
        <Button size="sm" variant="ghost" className="gap-1.5 text-xs h-7">
          <UserPlus className="h-3.5 w-3.5" /> Taklif
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Foydalanuvchi taklif qilish</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleInvite} className="space-y-4 mt-2">
          {error && <p className="text-sm text-destructive">{error}</p>}
          {success && <p className="text-sm text-emerald-500">{success}</p>}
          <div className="space-y-2">
            <Label htmlFor="invite-username">Username</Label>
            <Input
              id="invite-username"
              placeholder="foydalanuvchi username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Yopish
            </Button>
            <Button type="submit" disabled={isLoading || !username.trim()}>
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Yuborilmoqda...</> : "Taklif yuborish"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
