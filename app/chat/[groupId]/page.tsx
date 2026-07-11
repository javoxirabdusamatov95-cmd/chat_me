// TODO (6-qadam): Bu sahifada guruh chat oynasi ko'rsatiladi.
//
// Tugallangan ko'rinish:
//
// import { ChatArea } from "@/components/chat/ChatArea"
//
// interface Props {
//   params: Promise<{ groupId: string }>
// }
//
// export default async function GroupChatPage({ params }: Props) {
//   const { groupId } = await params
//   return <ChatArea groupId={Number(groupId)} />
// }
//
// ChatArea komponentini yaratish uchun 6-qadam ga qarang.

import { ChatArea } from '@/components/chat/ChatArea'

interface Props {
	params: Promise<{ groupId: string }>
}

export default async function GroupChatPage({ params }: Props) {
	const { groupId } = await params
	return <ChatArea groupId={Number(groupId)} />
}
