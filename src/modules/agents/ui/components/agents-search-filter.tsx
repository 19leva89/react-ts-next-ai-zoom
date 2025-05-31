import { SearchIcon, XCircleIcon } from 'lucide-react'

import { DEFAULT_PAGE } from '@/constants'
import { Button, Input } from '@/components/ui'
import { useAgentsFilters } from '@/modules/agents/hooks/use-agents-filters'

export const AgentsSearchFilter = () => {
	const [filters, setFilters] = useAgentsFilters()

	const isAnyFilterModified = !!filters.search

	const onClearFilters = () => setFilters({ search: '', page: DEFAULT_PAGE })

	return (
		<div className='relative w-64'>
			<Input
				placeholder='Filter by name'
				value={filters.search}
				onChange={(e) => setFilters({ search: e.target.value })}
				className='h-9 bg-white pr-9 pl-7'
			/>

			<SearchIcon className='text-muted-foreground absolute top-1/2 left-2 size-4 -translate-y-1/2' />

			{isAnyFilterModified && (
				<Button
					variant='ghost'
					size='icon'
					onClick={onClearFilters}
					className='text-muted-foreground hover:text-foreground absolute top-1/2 right-1 -translate-y-1/2 hover:bg-transparent'
				>
					<XCircleIcon />
				</Button>
			)}
		</div>
	)
}
