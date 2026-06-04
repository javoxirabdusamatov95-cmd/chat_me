import { MessageCircle } from "lucide-react"

export default function ChatPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
      <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/20">
        <MessageCircle className="h-10 w-10 text-white" />
      </div>
      <h2 className="text-2xl font-bold mb-2">ChatMe&apos;ga xush kelibsiz!</h2>
      <p className="text-muted-foreground max-w-sm">
        Chap tarafdagi guruhlardan birini tanlang yoki yangi guruh yarating.
      </p>
    </div>
  )
}
