'use client'

import { useRouter } from 'next/navigation'
import { useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { columns } from '@/modules/meetings/ui/components/columns'
import { useMeetingsFilters } from '@/modules/meetings/hooks/use-meetings-filters'
import { DataPagination, DataTable, EmptyState, ErrorState, LoadingState } from '@/components/shared'

export const MeetingsView = () => {
	const trpc = useTRPC()
	const router = useRouter()

	const [filters, setFilters] = useMeetingsFilters()

	const { data } = useSuspenseQuery(
		trpc.meetings.getMany.queryOptions({
			...filters,
		}),
	)

	return (
		<div className='flex flex-1 flex-col gap-y-5 px-4 pb-4 md:px-8'>
			<DataTable
				data={data.items}
				columns={columns}
				onRowClick={(row) => router.push(`/meetings/${row.id}`)}
			/>

			<DataPagination
				page={filters.page}
				totalPages={data.totalPages}
				onPageChange={(page) => setFilters({ page })}
			/>

			{data.items.length === 0 && (
				<EmptyState
					title='Create your first meeting'
					description='Schedule a meeting to connect with others. Each meeting lets you collaborate, share ideas, and interact with participants in real time'
				/>
			)}
		</div>
	)
}

export const MeetingsViewLoading = () => {
	return <LoadingState title='Loading meetings' description='This may be take a seconds' />
}

export const MeetingsViewError = () => {
	return <ErrorState title='Error loading meetings' description='Something went wrong' />
}
