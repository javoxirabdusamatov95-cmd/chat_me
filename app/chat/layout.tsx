// TODO (3-qadam): Bu layout Sidebar komponentini o'z ichiga olishi kerak.
//
// Tugallangan ko'rinish:
//
// import { Sidebar } from "@/components/chat/Sidebar"
//
// export default function ChatLayout({ children }) {
//   return (
//     <div className="flex h-screen overflow-hidden bg-background">
//       <Sidebar />
//       <main className="flex-1 flex flex-col min-w-0">{children}</main>
//     </div>
//   )
// }

"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/chat/Sidebar";

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const pathnameHasGroup = /^\/chat\/\d+/.test(pathname);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <main
        className={`
          flex-1 flex-col min-w-0 pb-14 md:pb-0
          ${pathnameHasGroup ? "flex" : "hidden md:flex"}
        `}
      >
        {children}
      </main>
    </div>
  );
}
