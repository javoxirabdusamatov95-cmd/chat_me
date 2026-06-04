import type { Metadata } from "next"
import "./globals.css"
import { Providers } from "@/components/shared/providers"

export const metadata: Metadata = {
  title: "ChatMe",
  description: "Guruh chat ilovasi",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
