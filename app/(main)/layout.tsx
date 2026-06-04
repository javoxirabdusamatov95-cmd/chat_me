"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/authStore"
import { Loader2 } from "lucide-react"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { user, fetchMe } = useAuthStore()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("access_token")
    if (!token) {
      router.replace("/login")
      setChecking(false)
      return
    }
    if (!user) {
      fetchMe()
        .catch(() => {
          localStorage.removeItem("access_token")
          router.replace("/login")
        })
        .finally(() => setChecking(false))
    } else {
      setChecking(false)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <Loader2 className="h-5 w-5 text-white animate-spin" />
          </div>
          <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
