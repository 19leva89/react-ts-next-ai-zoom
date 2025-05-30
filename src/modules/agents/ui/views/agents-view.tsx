'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { columns } from '@/modules/agents/ui/components/columns'
import { DataTable } from '@/modules/agents/ui/components/data-table'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared'
import { useAgentsFilters } from '@/modules/agents/hooks/use-agents-filters'
import { DataPagination } from '@/modules/agents/ui/components/data-pagination'

export const AgentsView = () => {
	const trpc = useTRPC()

	const [filters, setFilters] = useAgentsFilters()

	const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions({ ...filters }))

	return (
		<div className="flex flex-1 flex-col gap-y-4 pb-4 px-4 md:px-8">
			<DataTable data={data.items} columns={columns} />

			<DataPagination
				page={filters.page}
				totalPages={data.totalPages}
				onPageChange={(page) => setFilters({ page })}
			/>

			{data.items.length === 0 && (
				<EmptyState
					title="Create your first agent"
					description="Create an agent to join your meetings. Each agent will follow your instructions and can interact with participants during the call."
				/>
			)}
		</div>
	)
}

export const AgentsViewLoading = () => {
	return <LoadingState title="Loading agents" description="This may take a few seconds" />
}

export const AgentsViewError = () => {
	return <ErrorState title="Failed to load agents" description="Please try again later" />
}
