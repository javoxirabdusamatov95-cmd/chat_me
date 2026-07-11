// TODO (3-qadam): Bu sahifaga guruhlar ro'yxati va welcome xabar qo'shing.
// Sidebar tayyor bo'lgandan keyin bu sahifa faqat o'rta qismni ko'rsatadi.

import { MessageSquare } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="flex-1 flex items-center justify-center text-center p-8">
      <div>
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent flex items-center justify-center">
          <MessageSquare size={28} className="text-muted-foreground" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Guruhni tanlang</h2>
        <p className="text-muted-foreground">
          Suhbatni boshlash uchun chapdagi ro'yxatdan guruh tanlang
          <br />
          yoki yangi guruh yarating
        </p>
      </div>
    </div>
  );
}
