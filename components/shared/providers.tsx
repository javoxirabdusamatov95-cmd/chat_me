"use client"
import { ThemeProvider } from "next-themes"
import { ToastProvider, ToastViewport } from "@/components/ui/toast"

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <ToastProvider>
        {children}
        <ToastViewport />
      </ToastProvider>
    </ThemeProvider>
  )
}
