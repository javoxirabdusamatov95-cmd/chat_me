'use client'
import { useEffect, useState } from 'react'
import { Bell, Check, X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { invitationsApi } from '@/lib/api'
import { useChatStore } from '@/store/chatStore'
import { IconRail } from '@/components/shared/IconRail'
import type { InvitationResponse } from '@/types'

export default function InvitationsPage() {
	const { addGroup, fetchGroups } = useChatStore()
	const [invitations, setInvitations] = useState<InvitationResponse[]>([])
	const [isLoading, setIsLoading] = useState(true)
	const [processingId, setProcessingId] = useState<number | null>(null)

	useEffect(() => {
		invitationsApi
			.getMyInvitations()
			.then(setInvitations)
			.finally(() => setIsLoading(false))
	}, [])

	const pending = invitations.filter(i => i.status === 'pending')
	const others = invitations.filter(i => i.status !== 'pending')

	const handleAccept = async (inv: InvitationResponse) => {
		setProcessingId(inv.id)
		try {
			await invitationsApi.accept(inv.id)
			setInvitations(prev =>
				prev.map(i =>
					i.id === inv.id ? { ...i, status: 'accepted' as const } : i,
				),
			)
			addGroup(inv.group)
			await fetchGroups()
		} finally {
			setProcessingId(null)
		}
	}

	const handleReject = async (inv: InvitationResponse) => {
		setProcessingId(inv.id)
		try {
			await invitationsApi.reject(inv.id)
			setInvitations(prev =>
				prev.map(i =>
					i.id === inv.id ? { ...i, status: 'rejected' as const } : i,
				),
			)
		} finally {
			setProcessingId(null)
		}
	}

	return (
		<div className='h-screen overflow-hidden bg-background flex'>
			<IconRail />

			<div className='flex-1 flex flex-col min-h-0 pb-14 md:pb-0'>
				<div className='flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0'>
					<Bell className='h-5 w-5 text-primary' />
					<h1 className='font-semibold'>Takliflar</h1>
					{pending.length > 0 && <Badge>{pending.length}</Badge>}
				</div>

				<div className='flex-1 overflow-y-auto p-6'>
					<div className='max-w-lg mx-auto space-y-6'>
						{isLoading ? (
							<div className='flex items-center justify-center py-12'>
								<Loader2 className='h-6 w-6 animate-spin text-primary' />
							</div>
						) : pending.length === 0 && others.length === 0 ? (
							<div className='text-center py-12'>
								<Bell className='h-12 w-12 mx-auto mb-4 text-muted-foreground/30' />
								<p className='text-muted-foreground'>Hali takliflar yo&apos;q</p>
								<p className='text-sm text-muted-foreground/60 mt-1'>
									Kimdir sizni guruhga taklif qilganda shu yerda ko&apos;rinadi
								</p>
							</div>
						) : (
							<>
								{pending.length > 0 && (
									<section>
										<h2 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3'>
											Kutilmoqda ({pending.length})
										</h2>
										<div className='space-y-2'>
											{pending.map(inv => (
												<Card key={inv.id}>
													<CardContent className='pt-4 pb-4'>
														<div className='flex items-start gap-3'>
															<div className='h-10 w-10 rounded-xl bg-violet-500 flex items-center justify-center text-white font-bold shrink-0'>
																{inv.group.name[0].toUpperCase()}
															</div>
															<div className='flex-1 min-w-0'>
																<p className='font-semibold text-sm'>
																	{inv.group.name}
																</p>
																{inv.group.description && (
																	<p className='text-xs text-muted-foreground truncate'>
																		{inv.group.description}
																	</p>
																)}
																<p className='text-xs text-muted-foreground mt-1'>
																	<strong>{inv.inviter.username}</strong> taklif
																	qildi
																</p>
															</div>
														</div>
														<div className='flex gap-2 mt-3'>
															<Button
																size='sm'
																className='flex-1 h-8'
																onClick={() => handleAccept(inv)}
																disabled={processingId === inv.id}
															>
																{processingId === inv.id ? (
																	<Loader2 className='h-3.5 w-3.5 animate-spin' />
																) : (
																	<>
																		<Check className='h-3.5 w-3.5' /> Qabul
																	</>
																)}
															</Button>
															<Button
																size='sm'
																variant='outline'
																className='flex-1 h-8'
																onClick={() => handleReject(inv)}
																disabled={processingId === inv.id}
															>
																<X className='h-3.5 w-3.5' /> Rad
															</Button>
														</div>
													</CardContent>
												</Card>
											))}
										</div>
									</section>
								)}

								{others.length > 0 && (
									<section>
										<h2 className='text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3'>
											Tarix
										</h2>
										<div className='space-y-2 opacity-60'>
											{others.map(inv => (
												<Card key={inv.id}>
													<CardContent className='py-3 px-4 flex items-center gap-3'>
														<div className='h-8 w-8 rounded-lg bg-violet-500 flex items-center justify-center text-white font-bold text-xs shrink-0'>
															{inv.group.name[0].toUpperCase()}
														</div>
														<p className='text-sm flex-1 truncate'>
															{inv.group.name}
														</p>
														<Badge
															variant={
																inv.status === 'accepted'
																	? 'default'
																	: 'destructive'
															}
															className='text-[10px]'
														>
															{inv.status === 'accepted' ? 'Qabul' : 'Rad'}
														</Badge>
													</CardContent>
												</Card>
											))}
										</div>
									</section>
								)}
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
