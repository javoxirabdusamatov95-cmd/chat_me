"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { MessageSquare, Search, Bell, User, Sun, Moon } from "lucide-react"

export function IconRail() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const isActive = (path: string) =>
    path === "/chat"
      ? pathname === "/chat" || /^\/chat\/\d+/.test(pathname)
      : pathname === path

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <nav
      className="
        flex md:flex-col items-center gap-1 md:gap-3
        px-2 py-0 md:py-4
        w-full md:w-16 h-14 md:h-full
        flex-row md:flex-col justify-around md:justify-start
        bg-background border-t md:border-t-0 md:border-r border-border
        fixed bottom-0 left-0 right-0 md:static
        z-20
      "
    >
      <Link
        href="/chat"
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
          isActive("/chat") ? "bg-primary text-primary-foreground" : "hover:bg-accent"
        }`}
      >
        <MessageSquare size={18} />
      </Link>

      <button
        type="button"
        onClick={() => window?.dispatchEvent(new CustomEvent('focus-group-search'))}
        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
        aria-label="Guruhlarni qidirish"
      >
        <Search size={18} />
      </button>

      <Link
        href="/chat/invitations"
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
          isActive("/chat/invitations") ? "bg-primary text-primary-foreground" : "hover:bg-accent"
        }`}
      >
        <Bell size={18} />
      </Link>

      <div className="hidden md:block flex-1" />

      <Link
        href="/profile"
        className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
          isActive("/profile") ? "bg-primary text-primary-foreground" : "hover:bg-accent"
        }`}
      >
        <User size={18} />
      </Link>

      <button
        type="button"
        onClick={toggleTheme}
        className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-accent transition-colors"
        aria-label="Tema almashtirish"
      >
        {mounted && theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
      </button>
    </nav>
  )
}

export default IconRail