import { Suspense } from 'react'
import { headers } from 'next/headers'
import type { SearchParams } from 'nuqs'
import { redirect } from 'next/navigation'
import { ErrorBoundary } from 'react-error-boundary'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { auth } from '@/lib/auth'
import { getQueryClient, trpc } from '@/trpc/server'
import { loadSearchParams } from '@/modules/agents/params'
import { AgentsListHeader } from '@/modules/agents/ui/components/agents-list-header'
import { AgentsView, AgentsViewError, AgentsViewLoading } from '@/modules/agents/ui/views/agents-view'

interface Props {
	searchParams: Promise<SearchParams>
}

const AgentsPage = async ({ searchParams }: Props) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session) {
		redirect('/sign-in')
	}

	const queryClient = getQueryClient()
	const filters = await loadSearchParams(searchParams)

	void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions({ ...filters }))

	return (
		<>
			<AgentsListHeader />

			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense fallback={<AgentsViewLoading />}>
					<ErrorBoundary fallback={<AgentsViewError />}>
						<AgentsView />
					</ErrorBoundary>
				</Suspense>
			</HydrationBoundary>
		</>
	)
}

export default AgentsPage
