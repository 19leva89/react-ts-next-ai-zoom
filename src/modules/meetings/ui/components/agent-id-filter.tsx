import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { MAX_PAGE_SIZE } from '@/constants'
import { CommandSelect, GeneratedAvatar } from '@/components/shared'
import { useMeetingsFilters } from '@/modules/meetings/hooks/use-meetings-filters'

export const AgentIdFilter = () => {
	const trpc = useTRPC()

	const [filters, setFilters] = useMeetingsFilters()
	const [agentSearch, setAgentSearch] = useState<string>('')

	const { data } = useQuery(
		trpc.agents.getMany.queryOptions({
			pageSize: MAX_PAGE_SIZE,
			search: agentSearch,
		}),
	)

	return (
		<CommandSelect
			placeholder='Agent'
			value={filters.agentId ?? ''}
			options={(data?.items ?? []).map((agent) => ({
				id: agent.id,
				value: agent.id,
				children: (
					<div className='flex items-center gap-x-2'>
						<GeneratedAvatar seed={agent.name} variant='botttsNeutral' className='size-4' />

						{agent.name}
					</div>
				),
			}))}
			onSelect={(value) => setFilters({ agentId: value })}
			onSearch={setAgentSearch}
			className='h-9'
		/>
	)
}
