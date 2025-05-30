'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { ErrorState, LoadingState } from '@/components/shared'

export const AgentsView = () => {
	const trpc = useTRPC()

	const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions())

	return <div>{JSON.stringify(data, null, 2)}</div>
}

export const AgentsViewLoading = () => {
	return <LoadingState title="Loading agents" description="This may take a few seconds" />
}

export const AgentsViewError = () => {
	return <ErrorState title="Failed to load agents" description="Please try again later" />
}
