'use client'

import { useState } from 'react'
import { PlusIcon, XCircleIcon } from 'lucide-react'

import { DEFAULT_PAGE } from '@/constants'
import { Button, ScrollArea, ScrollBar } from '@/components/ui'
import { StatusFilter } from '@/modules/meetings/ui/components/status-filter'
import { AgentIdFilter } from '@/modules/meetings/ui/components/agent-id-filter'
import { useMeetingsFilters } from '@/modules/meetings/hooks/use-meetings-filters'
import { NewMeetingDialog } from '@/modules/meetings/ui/components/new-meeting-dialog'
import { MeetingsSearchFilter } from '@/modules/meetings/ui/components/meetings-search-filter'

export const MeetingsListHeader = () => {
	const [filters, setFilters] = useMeetingsFilters()
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

	const isAnyFilterModified = !!filters.status || !!filters.search || filters.agentId

	const onClearFilters = () => {
		setFilters({
			status: null,
			agentId: '',
			search: '',
			page: DEFAULT_PAGE,
		})
	}

	return (
		<>
			<NewMeetingDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />

			<div className='flex flex-col gap-y-4 px-4 py-4 md:px-8'>
				<div className='flex items-center justify-between'>
					<h5 className='text-xl font-medium'>My Meetings</h5>

					<Button onClick={() => setIsDialogOpen(true)}>
						<PlusIcon />
						New Meeting
					</Button>
				</div>

				<ScrollArea>
					<div className='flex items-center gap-x-2 p-1'>
						<MeetingsSearchFilter />

						<StatusFilter />

						<AgentIdFilter />

						{isAnyFilterModified && (
							<Button variant='outline' onClick={onClearFilters}>
								<XCircleIcon className='size-4' />
								Clear
							</Button>
						)}
					</div>

					<ScrollBar orientation='horizontal' />
				</ScrollArea>
			</div>
		</>
	)
}
