"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Save, Loader2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { UserAvatar } from "@/components/shared/UserAvatar"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { useAuthStore } from "@/store/authStore"
import { usersApi } from "@/lib/api"
import { formatDate } from "@/lib/utils"

export default function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const [bio, setBio] = useState(user?.bio || "")
  const [avatar, setAvatar] = useState(user?.avatar || "")
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (user) {
      setBio(user.bio || "")
      setAvatar(user.avatar || "")
    }
  }, [user])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")
    setSuccess(false)
    try {
      const updated = await usersApi.updateMe({
        bio: bio.trim() || null,
        avatar: avatar.trim() || null,
      })
      setUser(updated)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { detail?: string } } })?.response?.data?.detail
      setError(msg || "Profilni yangilashda xato")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Topbar */}
      <div className="border-b border-border bg-card px-4 py-3 flex items-center gap-3">
        <Button asChild variant="ghost" size="icon" className="h-8 w-8">
          <Link href="/chat"><ArrowLeft className="h-4 w-4" /></Link>
        </Button>
        <h1 className="font-semibold">Mening profilim</h1>
        <div className="ml-auto">
          <ThemeToggle />
        </div>
      </div>

      <div className="max-w-lg mx-auto p-6 space-y-6">
        {/* Avatar preview */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <UserAvatar
                username={user?.username || "?"}
                avatar={avatar || user?.avatar}
                id={user?.id}
                size="lg"
              />
              <div>
                <h2 className="text-lg font-semibold">{user?.username}</h2>
                <p className="text-sm text-muted-foreground">
                  Qo&apos;shilgan: {user ? formatDate(user.created_at) : "—"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit form */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Profilni tahrirlash</CardTitle>
            <CardDescription>Bio va avatar URL ni yangilang</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              {success && (
                <Alert className="border-emerald-500 bg-emerald-500/10">
                  <AlertDescription className="text-emerald-600">
                    Profil muvaffaqiyatli yangilandi!
                  </AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={user?.username || ""} disabled className="bg-muted" />
                <p className="text-xs text-muted-foreground">Username o&apos;zgartirib bo&apos;lmaydi</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="avatar">Avatar URL</Label>
                <Input
                  id="avatar"
                  placeholder="https://example.com/avatar.jpg"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="O'zingiz haqida qisqa ma'lumot..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  maxLength={300}
                />
                <p className="text-xs text-muted-foreground text-right">{bio.length}/300</p>
              </div>
              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving
                  ? <><Loader2 className="h-4 w-4 animate-spin" /> Saqlanmoqda...</>
                  : <><Save className="h-4 w-4" /> Saqlash</>
                }
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Account info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4" /> Hisob ma&apos;lumotlari
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">ID</span>
              <span className="font-mono">#{user?.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Qo&apos;shilgan sana</span>
              <span>{user ? formatDate(user.created_at) : "—"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
