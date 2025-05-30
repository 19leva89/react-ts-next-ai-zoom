import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { PropsWithChildren } from 'react'

import { Toaster } from '@/components/ui'
import { TRPCReactProvider } from '@/trpc/client'

import './globals.css'

const inter = Inter({
	subsets: ['latin'],
})

export const metadata: Metadata = {
	title: 'Zoom.AI',
	description: 'AI-powered summaries for your Zoom meetings',
}

export default function RootLayout({ children }: PropsWithChildren) {
	return (
		<TRPCReactProvider>
			<html lang="en">
				<body className={`${inter.className} antialiased`}>
					<Toaster position="bottom-right" expand={false} richColors />

					{children}
				</body>
			</html>
		</TRPCReactProvider>
	)
}
