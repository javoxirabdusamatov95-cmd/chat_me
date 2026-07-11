'use client'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/store/chatStore'
import { useAuthStore } from '@/store/authStore'
import type { MessageResponse } from '@/types'

interface Props {
	message: MessageResponse
	groupId: number
	isAdmin: boolean // guruh admini bo'lsa boshqalar xabarini ham o'chira oladi
}

export function MessageItem({ message, groupId, isAdmin }: Props) {
	const { deleteMessage } = useChatStore()
	const { user } = useAuthStore()

	const isOwn = message.sender_id === user?.id
	const canDelete = isOwn || isAdmin

	const handleDelete = async () => {
		if (!confirm("Xabarni o'chirishni tasdiqlaysizmi?")) return
		await deleteMessage(groupId, message.id)
	}

	return (
		<div className={`flex gap-3 group ${isOwn ? 'flex-row-reverse' : ''}`}>
			{/* Avatar */}
			<div className='h-8 w-8 rounded-lg bg-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0'>
				{message.sender.username[0].toUpperCase()}
			</div>

			{/* Xabar */}
			<div
				className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}
			>
				{!isOwn && (
					<p className='text-xs text-muted-foreground px-1'>
						{message.sender.username}
					</p>
				)}
				<div
					className={`relative rounded-xl px-4 py-2.5 text-sm ${
						isOwn
							? 'bg-primary text-primary-foreground rounded-tr-sm'
							: 'bg-muted rounded-tl-sm'
					}`}
				>
					<p className='whitespace-pre-wrap break-words'>{message.content}</p>
					{canDelete && (
						<Button
							size='icon'
							variant='ghost'
							className='absolute -top-2 -right-2 h-6 w-6 opacity-0 group-hover:opacity-100 bg-background border border-border shadow-sm'
							onClick={handleDelete}
						>
							<Trash2 className='h-3 w-3' />
						</Button>
					)}
				</div>
				<p className='text-[10px] text-muted-foreground px-1'>
					{new Date(message.created_at).toLocaleTimeString('uz-UZ', {
						hour: '2-digit',
						minute: '2-digit',
					})}
				</p>
			</div>
		</div>
	)
}
