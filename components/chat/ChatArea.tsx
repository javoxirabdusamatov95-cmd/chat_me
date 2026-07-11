'use client'
import { useEffect, useRef, useCallback, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MessageItem } from './MessageItem'
import { MessageInput } from './MessageInput'
import { GroupSettingsDialog } from './GroupSettingsDialog'
import { useChatStore } from '@/store/chatStore'
import { useAuthStore } from '@/store/authStore'
import { groupsApi } from '@/lib/api'
import type { GroupDetailResponse, GroupMemberResponse, MessageResponse } from '@/types'

export function ChatArea({ groupId }: { groupId: number }) {
	const router = useRouter()
	const { user } = useAuthStore()
	const { messages, fetchMessages, pollMessages, setActiveGroup, removeGroup } =
		useChatStore()

	const [settingsOpen, setSettingsOpen] = useState(false)
	const [replyingTo, setReplyingTo] = useState<MessageResponse | null>(null)

	const [detail, setDetail] = useState<GroupDetailResponse | null>(null)
	const [members, setMembers] = useState<GroupMemberResponse[]>([])
	const [loading, setLoading] = useState(true)
	const scrollRef = useRef<HTMLDivElement>(null)
	const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

	const groupMessages = messages[groupId] ?? []
	const myRole = members.find(m => m.user_id === user?.id)?.role
	const isAdmin = myRole === 'admin'
	const isOwner = detail?.owner_id === user?.id

	const handleLeaveGroup = async () => {
		try {
			await groupsApi.leave(groupId)
			removeGroup(groupId)
			router.push('/chat')
		} catch {
			// leave failure can stay silent for now
		}
	}

	const handleDeleteGroup = async () => {
		try {
			await groupsApi.remove(groupId)
			removeGroup(groupId)
			router.push('/chat')
		} catch {
			// delete failure can stay silent for now
		}
	}

	// Guruh ma'lumotlari va xabarlarni yuklash
	const load = useCallback(async () => {
		setLoading(true)
		try {
			const [d, m] = await Promise.all([
				groupsApi.get(groupId),
				groupsApi.getMembers(groupId),
			])
			setDetail(d)
			setMembers(m)
		} catch {
			router.push('/chat') // guruh topilmasa asosiy chat ga qayt
		} finally {
			setLoading(false)
		}
	}, [groupId, router])

	useEffect(() => {
		setActiveGroup(groupId)
		load()
		fetchMessages(groupId)

		// Polling: har 3 soniyada yangi xabarlarni tekshirish
		intervalRef.current = setInterval(() => {
			pollMessages(groupId)
		}, 3000)

		return () => {
			if (intervalRef.current) clearInterval(intervalRef.current)
			setActiveGroup(null)
		}
	}, [groupId, load, fetchMessages, pollMessages, setActiveGroup])

	// Yangi xabar kelganda pastga scroll
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight
		}
	}, [groupMessages])

	if (loading) {
		return (
			<div className='flex-1 flex items-center justify-center'>
				<Loader2 className='h-6 w-6 animate-spin text-primary' />
			</div>
		)
	}

	return (
		<div className='flex-1 flex flex-col min-h-0'>
			{/* Header */}
			<div className='flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0'>
				<div className='h-10 w-10 rounded-xl bg-violet-500 flex items-center justify-center text-white font-bold'>
					{detail?.name?.[0] ?? '?'}
				</div>
				<div className='flex-1 min-w-0'>
					<h2 className='font-semibold text-sm truncate'>{detail?.name}</h2>
					<p className='text-xs text-muted-foreground'>
						{detail?.member_count} a&apos;zo
						{detail?.description && ` • ${detail.description}`}
					</p>
				</div>
				<div className='flex items-center gap-2'>
					<GroupSettingsDialog
						groupId={groupId}
						detail={detail}
						members={members}
						onLeave={handleLeaveGroup}
						onDelete={handleDeleteGroup}
						canDelete={isOwner}
						open={settingsOpen}
						onOpenChange={setSettingsOpen}
						initialTab='general'
					/>
				</div>
			</div>
			<div
				ref={scrollRef}
				className='flex-1 overflow-y-auto px-4 py-3 space-y-3'
			>
				{groupMessages.length === 0 ? (
					<div className='flex flex-col items-center justify-center h-full text-center'>
						<div className='h-16 w-16 rounded-2xl bg-violet-500 flex items-center justify-center text-white text-2xl font-bold mb-4'>
							{detail?.name?.[0] ?? '?'}
						</div>
						<h3 className='font-semibold'>{detail?.name}</h3>
						<p className='text-muted-foreground text-sm mt-1'>
							Bu guruhning boshlanishi. Birinchi xabarni yuboring!
						</p>
					</div>
				) : (
					groupMessages.map(msg => (
						<MessageItem
							key={msg.id}
							message={msg}
							groupId={groupId}
							isAdmin={isAdmin}
							onReply={setReplyingTo}
						/>
					))
				)}
			</div>

			{/* Xabar yozish */}
			<MessageInput
				groupId={groupId}
				replyingTo={replyingTo}
				onCancelReply={() => setReplyingTo(null)}
			/>
		</div>
	)
}