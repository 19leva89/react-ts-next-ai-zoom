import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
	async redirects() {
		return [
			{
				source: '/',
				destination: '/meetings',
				permanent: true,
			},
		]
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'avatars.githubusercontent.com',
			},
		],
		unoptimized: true,
	},
	reactStrictMode: false,
}

export default nextConfig
