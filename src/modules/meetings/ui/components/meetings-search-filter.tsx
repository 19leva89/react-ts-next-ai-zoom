import { SearchIcon } from 'lucide-react'

import { Input } from '@/components/ui'
import { useMeetingsFilters } from '@/modules/meetings/hooks/use-meetings-filters'

export const MeetingsSearchFilter = () => {
	const [filters, setFilters] = useMeetingsFilters()

	return (
		<div className='relative w-64'>
			<Input
				placeholder='Filter by name'
				value={filters.search}
				onChange={(e) => setFilters({ search: e.target.value })}
				className='h-9 bg-white pl-7'
			/>

			<SearchIcon className='absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground' />
		</div>
	)
}
