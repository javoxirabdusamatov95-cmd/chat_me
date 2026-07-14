import { Providers } from '@/components/shared/providers'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL("https://bleachchat.uz"),
  title: {
    default: "Mening Do'konim",
    template: "%s | Mening Do'konim",
  },
  description: "Eng sifatli mahsulotlar arzon narxda",
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
