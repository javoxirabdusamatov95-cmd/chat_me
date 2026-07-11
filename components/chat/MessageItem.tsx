'use client'
import { useState } from 'react'
import { Trash2, Pencil, Reply, Smile, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/store/chatStore'
import { useAuthStore } from '@/store/authStore'
import type { MessageResponse } from '@/types'

const QUICK_EMOJIS = ['👍', '❤️', '😂', '😮', '😢', '🙏']

interface Props {
	message: MessageResponse
	groupId: number
	isAdmin: boolean
	onReply: (message: MessageResponse) => void
}

export function MessageItem({ message, groupId, isAdmin, onReply }: Props) {
	const { deleteMessage, editMessage, toggleReaction } = useChatStore()
	const { user } = useAuthStore()

	const [isEditing, setIsEditing] = useState(false)
	const [editValue, setEditValue] = useState(message.content)
	const [showEmojiPicker, setShowEmojiPicker] = useState(false)

	const isOwn = message.sender_id === user?.id
	const canDelete = isOwn || isAdmin
	const canEdit = isOwn

	const handleDelete = async () => {
		if (!confirm("Xabarni o'chirishni tasdiqlaysizmi?")) return
		await deleteMessage(groupId, message.id)
	}

	const handleSaveEdit = async () => {
		const trimmed = editValue.trim()
		if (!trimmed || trimmed === message.content) {
			setIsEditing(false)
			return
		}
		await editMessage(groupId, message.id, trimmed)
		setIsEditing(false)
	}

	const handleReact = async (emoji: string) => {
		setShowEmojiPicker(false)
		await toggleReaction(groupId, message.id, emoji)
	}

	return (
		<div className={`flex gap-3 ${isOwn ? 'flex-row-reverse' : ''}`}>
			<div className='h-8 w-8 rounded-lg bg-violet-500 flex items-center justify-center text-white text-xs font-bold shrink-0'>
				{message.sender.username[0].toUpperCase()}
			</div>

			<div
				className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}
			>
				{!isOwn && (
					<p className='text-xs text-muted-foreground px-1'>
						{message.sender.username}
					</p>
				)}

				{message.reply_to && (
					<div
						className={`text-xs px-3 py-1.5 rounded-t-lg border-l-2 border-primary bg-muted/50 w-full ${
							isOwn ? 'text-right' : 'text-left'
						}`}
					>
						<p className='font-semibold text-primary'>
							{message.reply_to.sender.username}
						</p>
						<p className='text-muted-foreground truncate'>
							{message.reply_to.content}
						</p>
					</div>
				)}

				<div
					className={`rounded-xl px-4 py-2.5 text-sm ${
						isOwn
							? 'bg-primary text-primary-foreground rounded-tr-sm'
							: 'bg-muted rounded-tl-sm'
					} ${message.reply_to ? 'rounded-t-none' : ''}`}
				>
					{isEditing ? (
						<div className='flex flex-col gap-2'>
							<textarea
								value={editValue}
								onChange={e => setEditValue(e.target.value)}
								className='w-full bg-transparent border border-current/30 rounded px-2 py-1 text-sm resize-none focus:outline-none'
								rows={2}
								autoFocus
							/>
							<div className='flex gap-1 justify-end'>
								<Button
									size='icon'
									variant='ghost'
									className='h-6 w-6'
									onClick={() => setIsEditing(false)}
								>
									<X className='h-3 w-3' />
								</Button>
								<Button
									size='icon'
									variant='ghost'
									className='h-6 w-6'
									onClick={handleSaveEdit}
								>
									<Check className='h-3 w-3' />
								</Button>
							</div>
						</div>
					) : (
						<p className='whitespace-pre-wrap break-words'>
							{message.content}
							{message.is_edited && (
								<span className='text-[10px] opacity-60 ml-1'>
									(tahrirlangan)
								</span>
							)}
						</p>
					)}
				</div>

				{/* Doim ko'rinadigan amallar qatori */}
				<div className='relative flex items-center gap-1'>
					<button
						onClick={() => onReply(message)}
						className='text-muted-foreground hover:text-foreground p-1 rounded transition-colors'
						title='Javob berish'
					>
						<Reply className='h-3.5 w-3.5' />
					</button>

					<button
						onClick={() => setShowEmojiPicker(v => !v)}
						className='text-muted-foreground hover:text-foreground p-1 rounded transition-colors'
						title='Reaksiya'
					>
						<Smile className='h-3.5 w-3.5' />
					</button>

					{showEmojiPicker && (
						<div
							className={`absolute bottom-7 ${isOwn ? 'right-0' : 'left-0'} flex gap-1 bg-background border border-border rounded-lg shadow-md px-2 py-1.5 z-20`}
						>
							{QUICK_EMOJIS.map(emoji => (
								<button
									key={emoji}
									className='hover:scale-125 transition-transform text-base'
									onClick={() => handleReact(emoji)}
								>
									{emoji}
								</button>
							))}
						</div>
					)}

					{canEdit && (
						<button
							onClick={() => {
								setEditValue(message.content)
								setIsEditing(true)
							}}
							className='text-muted-foreground hover:text-foreground p-1 rounded transition-colors'
							title='Tahrirlash'
						>
							<Pencil className='h-3.5 w-3.5' />
						</button>
					)}

					{canDelete && (
						<button
							onClick={handleDelete}
							className='text-muted-foreground hover:text-destructive p-1 rounded transition-colors'
							title="O'chirish"
						>
							<Trash2 className='h-3.5 w-3.5' />
						</button>
					)}
				</div>

				{message.reactions.length > 0 && (
					<div className='flex flex-wrap gap-1'>
						{message.reactions.map(r => {
							const reacted = user ? r.user_ids.includes(user.id) : false
							return (
								<button
									key={r.emoji}
									onClick={() => handleReact(r.emoji)}
									className={`text-xs px-1.5 py-0.5 rounded-full border transition-colors ${
										reacted
											? 'bg-primary/20 border-primary text-primary'
											: 'bg-muted border-border text-muted-foreground hover:bg-accent'
									}`}
								>
									{r.emoji} {r.count}
								</button>
							)
						})}
					</div>
				)}

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