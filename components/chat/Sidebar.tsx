"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { useChatStore } from "@/store/chatStore";
import { useAuthStore } from "@/store/authStore";
import { CreateGroupModal } from "./CreateGroupModal";
import { IconRail } from "@/components/shared/IconRail";

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const { user } = useAuthStore();
  const { groups, isLoadingGroups, fetchGroups } = useChatStore();
  const [search, setSearch] = useState("");
  const searchRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  useEffect(() => {
    const handler = () => {
      if (searchRef.current) {
        searchRef.current.focus();
        try {
          searchRef.current.select();
        } catch {}
      }
    };
    window.addEventListener("focus-group-search", handler as EventListener);
    return () => window.removeEventListener("focus-group-search", handler as EventListener);
  }, []);

  const filteredGroups = groups.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  );

  const userInitial = user?.username?.[0]?.toUpperCase() ?? "?";
  const pathnameHasGroup = /^\/chat\/\d+/.test(pathname);

  return (
    <>
      <IconRail />

      <aside
        className={`
          border-r border-border flex-col h-full
          pb-14 md:pb-0
          md:w-[280px] md:flex
          ${pathnameHasGroup ? "hidden w-0" : "flex w-full"}
        `}
      >
        <button
          onClick={() => router.push("/profile")}
          className="flex items-center gap-3 p-4 hover:bg-accent/50 transition-colors text-left shrink-0"
        >
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0">
              {userInitial}
            </div>
          )}
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">{user?.username}</p>
            <p className="text-xs text-green-500">@{user?.username}</p>
          </div>
        </button>

        <div className="px-4 pb-3 space-y-3 shrink-0">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              ref={searchRef}
              placeholder="Guruhlarni qidirish..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <CreateGroupModal />
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1">
          {isLoadingGroups ? (
            <div className="flex justify-center py-8">
              <Loader2 className="animate-spin text-muted-foreground" size={20} />
            </div>
          ) : filteredGroups.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Guruhlar topilmadi
            </p>
          ) : (
            filteredGroups.map((group) => {
              const active = pathname === `/chat/${group.id}`;
              return (
                <button
                  key={group.id}
                  onClick={() => router.push(`/chat/${group.id}`)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                    active ? "bg-accent" : "hover:bg-accent/50"
                  }`}
                >
                  {group.avatar ? (
                    <img
                      src={group.avatar}
                      alt={group.name}
                      className="w-10 h-10 rounded-full object-cover shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center text-white font-semibold shrink-0">
                      {group.name[0]?.toUpperCase()}
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{group.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {group.description || "Xabarlar yo'q"}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>
    </>
  );
}