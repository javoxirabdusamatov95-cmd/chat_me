'use client'
import { useState, useRef, useCallback, useEffect } from 'react'
import { Send, Loader2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/store/chatStore'
import type { MessageResponse } from '@/types'

interface Props {
	groupId: number
	replyingTo: MessageResponse | null
	onCancelReply: () => void
}

export function MessageInput({ groupId, replyingTo, onCancelReply }: Props) {
	const { sendMessage, isSending } = useChatStore()
	const [content, setContent] = useState('')
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	const adjustHeight = useCallback(() => {
		const el = textareaRef.current
		if (!el) return
		el.style.height = 'auto'
		el.style.height = Math.min(el.scrollHeight, 120) + 'px'
	}, [])

	useEffect(() => {
		if (replyingTo) textareaRef.current?.focus()
	}, [replyingTo])

	const handleSend = async () => {
		const text = content.trim()
		if (!text || isSending) return
		setContent('')
		if (textareaRef.current) textareaRef.current.style.height = 'auto'
		try {
			await sendMessage(groupId, text, replyingTo?.id ?? null)
			onCancelReply()
		} catch {
			setContent(text)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
		if (e.key === 'Escape' && replyingTo) {
			onCancelReply()
		}
	}

	return (
		<div className='border-t border-border bg-background'>
			{replyingTo && (
				<div className='flex items-center justify-between px-4 py-2 bg-muted/50 border-l-2 border-primary'>
					<div className='min-w-0'>
						<p className='text-xs font-semibold text-primary'>
							{replyingTo.sender.username}ga javob
						</p>
						<p className='text-xs text-muted-foreground truncate'>
							{replyingTo.content}
						</p>
					</div>
					<Button
						size='icon'
						variant='ghost'
						className='h-6 w-6 shrink-0'
						onClick={onCancelReply}
					>
						<X className='h-3.5 w-3.5' />
					</Button>
				</div>
			)}

			<div className='flex items-end gap-2 p-4'>
				<div className='flex-1'>
					<textarea
						ref={textareaRef}
						value={content}
						onChange={e => {
							setContent(e.target.value)
							adjustHeight()
						}}
						onKeyDown={handleKeyDown}
						placeholder='Xabar yozing... (Enter — yuborish, Shift+Enter — yangi qator)'
						rows={1}
						disabled={isSending}
						className='w-full resize-none rounded-xl border border-input bg-muted/50 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring transition-colors min-h-[40px] max-h-[120px] overflow-hidden'
					/>
				</div>
				<Button
					size='icon'
					onClick={handleSend}
					disabled={!content.trim() || isSending}
					className='h-10 w-10 rounded-xl shrink-0'
				>
					{isSending ? (
						<Loader2 className='h-4 w-4 animate-spin' />
					) : (
						<Send className='h-4 w-4' />
					)}
				</Button>
			</div>
		</div>
	)
}
