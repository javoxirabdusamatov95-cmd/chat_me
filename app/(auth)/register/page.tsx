"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MessageCircle, Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { useAuthStore } from "@/store/authStore"

export default function RegisterPage() {
  const router = useRouter()
  const { register, isLoading, error, clearError } = useAuthStore()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [validationError, setValidationError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError("")
    clearError()
    if (password !== confirm) {
      setValidationError("Parollar mos kelmadi")
      return
    }
    if (username.length < 3) {
      setValidationError("Username kamida 3 ta belgi bo'lishi kerak")
      return
    }
    if (password.length < 6) {
      setValidationError("Parol kamida 6 ta belgi bo'lishi kerak")
      return
    }
    try {
      await register({ username, password })
      router.push("/chat")
    } catch {
      // error is set in store
    }
  }

  const displayError = validationError || error

  return (
    <div className="relative">
      <div className="absolute top-0 right-0 -mt-2">
        <ThemeToggle />
      </div>
      <Card className="shadow-2xl border-border/50">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
              ChatMe
            </span>
          </div>
          <CardTitle className="text-xl">Ro&apos;yxatdan o&apos;tish</CardTitle>
          <CardDescription>Yangi hisob yarating va chatni boshlang</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {displayError && (
              <Alert variant="destructive">
                <AlertDescription>{displayError}</AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="username (kamida 3 belgi)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                minLength={3}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Parol</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="kamida 6 belgi"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Parolni tasdiqlang</Label>
              <Input
                id="confirm"
                type={showPassword ? "text" : "password"}
                placeholder="parolni qayta kiriting"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <><Loader2 className="h-4 w-4 animate-spin" /> Yaratilmoqda...</> : "Hisob yaratish"}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Hisobingiz bormi?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Kirish
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
