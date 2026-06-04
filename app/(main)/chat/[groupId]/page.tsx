import { ChatArea } from "@/components/chat/ChatArea"

interface Props {
  params: Promise<{ groupId: string }>
}

export default async function GroupChatPage({ params }: Props) {
  const { groupId } = await params
  return <ChatArea groupId={Number(groupId)} />
}
