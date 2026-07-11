'use client'
import { useState, useRef, useCallback } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useChatStore } from '@/store/chatStore'

export function MessageInput({ groupId }: { groupId: number }) {
	const { sendMessage, isSending } = useChatStore()
	const [content, setContent] = useState('')
	const textareaRef = useRef<HTMLTextAreaElement>(null)

	// Textarea balandligini matn miqdoriga qarab o'zgartirish
	const adjustHeight = useCallback(() => {
		const el = textareaRef.current
		if (!el) return
		el.style.height = 'auto'
		el.style.height = Math.min(el.scrollHeight, 120) + 'px'
	}, [])

	const handleSend = async () => {
		const text = content.trim()
		if (!text || isSending) return
		setContent('')
		if (textareaRef.current) textareaRef.current.style.height = 'auto'
		try {
			await sendMessage(groupId, text)
		} catch {
			setContent(text) // xato bo'lsa matnni qaytarish
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		// Enter — yuborish, Shift+Enter — yangi qator
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSend()
		}
	}

	return (
		<div className='flex items-end gap-2 p-4 border-t border-border bg-background'>
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
	)
}
