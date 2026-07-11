'use client'
import { useState } from 'react'
import { Search, Loader2, UserRound } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { usersApi } from '@/lib/api'
import type { UserResponse } from '@/types'

export default function UserSearchPage() {
	const [query, setQuery] = useState('')
	const [results, setResults] = useState<UserResponse[]>([])
	const [isLoading, setIsLoading] = useState(false)
	const [searched, setSearched] = useState(false)

	let debounceTimer: ReturnType<typeof setTimeout>

	const handleChange = (value: string) => {
		setQuery(value)
		clearTimeout(debounceTimer)
		if (!value.trim()) {
			setResults([])
			setSearched(false)
			return
		}
		debounceTimer = setTimeout(async () => {
			setIsLoading(true)
			setSearched(true)
			try {
				const data = await usersApi.search(value.trim())
				setResults(data)
			} catch {
				setResults([])
			} finally {
				setIsLoading(false)
			}
		}, 400)
	}

	return (
		<div className='flex-1 flex flex-col min-h-0'>
			<div className='flex items-center gap-3 px-4 py-3 border-b border-border bg-card shrink-0'>
				<Search className='h-5 w-5 text-primary' />
				<h1 className='font-semibold'>Foydalanuvchi qidirish</h1>
			</div>

			<div className='flex-1 overflow-y-auto p-6'>
				<div className='max-w-lg mx-auto space-y-4'>
					<Input
						autoFocus
						placeholder='Username kiriting...'
						value={query}
						onChange={(e) => handleChange(e.target.value)}
					/>

					{isLoading ? (
						<div className='flex items-center justify-center py-12'>
							<Loader2 className='h-6 w-6 animate-spin text-primary' />
						</div>
					) : !searched ? (
						<div className='text-center py-12'>
							<UserRound className='h-12 w-12 mx-auto mb-4 text-muted-foreground/30' />
							<p className='text-muted-foreground'>
								Foydalanuvchini topish uchun username kiriting
							</p>
						</div>
					) : results.length === 0 ? (
						<p className='text-sm text-muted-foreground text-center py-8'>
							Hech kim topilmadi
						</p>
					) : (
						<div className='space-y-2'>
							{results.map((u) => (
								<Card key={u.id}>
									<CardContent className='py-3 px-4 flex items-center gap-3'>
										{u.avatar ? (
											<img
												src={u.avatar}
												alt={u.username}
												className='h-10 w-10 rounded-full object-cover shrink-0'
											/>
										) : (
											<div className='h-10 w-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold shrink-0'>
												{u.username[0].toUpperCase()}
											</div>
										)}
										<div className='min-w-0'>
											<p className='font-semibold text-sm'>{u.username}</p>
											<p className='text-xs text-muted-foreground truncate'>
												{u.bio || 'Bio mavjud emas'}
											</p>
										</div>
									</CardContent>
								</Card>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}