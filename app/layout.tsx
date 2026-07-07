import { Providers } from '@/components/shared/providers'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
	title: 'ChatMe',
	description: 'Guruh chat ilovasi ',
}

export default function RootLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<html lang='uz' suppressHydrationWarning>
			<body>
				<Providers>{children}</Providers>
			</body>
		</html>
	)
}
