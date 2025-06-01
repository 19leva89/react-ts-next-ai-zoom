import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { PropsWithChildren } from 'react'
import { NuqsAdapter } from 'nuqs/adapters/next'

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

const RootLayout = ({ children }: PropsWithChildren) => {
	return (
		<html lang='en'>
			<body className={`${inter.className} antialiased`}>
				<Toaster position='bottom-right' expand={false} richColors />

				<NuqsAdapter>
					<TRPCReactProvider>{children}</TRPCReactProvider>
				</NuqsAdapter>
			</body>
		</html>
	)
}

export default RootLayout
