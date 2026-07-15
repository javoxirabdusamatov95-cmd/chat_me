import { Providers } from '@/components/shared/providers'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL("https://bleachchat.uz"),
  title: {
    default: "bleachchat.uz ",
    template: "%s | bleachchat.uz ",
  },
  description: "Guruh chat ilovasi bleachchat.uz",
};
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
