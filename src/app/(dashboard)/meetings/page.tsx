import { Suspense } from 'react'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import type { SearchParams } from 'nuqs/server'
import { ErrorBoundary } from 'react-error-boundary'
import { dehydrate, HydrationBoundary } from '@tanstack/react-query'

import { auth } from '@/lib/auth'
import {
	MeetingsView,
	MeetingsViewError,
	MeetingsViewLoading,
} from '@/modules/meetings/ui/views/meetings-view'
import { getQueryClient, trpc } from '@/trpc/server'
import { loadSearchParams } from '@/modules/meetings/params'
import { MeetingsListHeader } from '@/modules/meetings/ui/components/meetings-list-header'

interface Props {
	searchParams: Promise<SearchParams>
}

const MeetingsPage = async ({ searchParams }: Props) => {
	const session = await auth.api.getSession({
		headers: await headers(),
	})

	if (!session) {
		redirect('/sign-in')
	}

	const queryClient = getQueryClient()
	const filters = await loadSearchParams(searchParams)

	void queryClient.prefetchQuery(
		trpc.meetings.getMany.queryOptions({
			...filters,
		}),
	)

	return (
		<>
			<MeetingsListHeader />

			<HydrationBoundary state={dehydrate(queryClient)}>
				<Suspense fallback={<MeetingsViewLoading />}>
					<ErrorBoundary fallback={<MeetingsViewError />}>
						<MeetingsView />
					</ErrorBoundary>
				</Suspense>
			</HydrationBoundary>
		</>
	)
}

export default MeetingsPage
