'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { columns } from '@/modules/agents/ui/components/columns'
import { DataTable } from '@/modules/agents/ui/components/data-table'
import { EmptyState, ErrorState, LoadingState } from '@/components/shared'

export const AgentsView = () => {
	const trpc = useTRPC()

	const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions())

	return (
		<div className="flex flex-1 flex-col gap-y-4 pb-4 px-4 md:px-8">
			<DataTable data={data} columns={columns} />

			{data.length === 0 && (
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
