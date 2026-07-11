import { IconRail } from "@/components/shared/IconRail";

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <IconRail />
      <main className="flex-1 flex flex-col min-w-0">{children}</main>
    </div>
  );
}
