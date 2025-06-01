'use client'

import { useState } from 'react'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui'
import { NewAgentDialog } from '@/modules/agents/ui/components/new-agent-dialog'
import { AgentsSearchFilter } from '@/modules/agents/ui/components/agents-search-filter'

export const AgentsListHeader = () => {
	const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)

	return (
		<>
			<div className='flex flex-col gap-y-4 px-4 py-4 md:px-8'>
				<div className='flex items-center justify-between'>
					<h5 className='text-xl font-medium'>My agents</h5>

					<Button onClick={() => setIsDialogOpen(true)}>
						<PlusIcon />
						New agent
					</Button>
				</div>

				<div className='flex items-center gap-x-2 p-1'>
					<AgentsSearchFilter />
				</div>
			</div>

			<NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
		</>
	)
}
