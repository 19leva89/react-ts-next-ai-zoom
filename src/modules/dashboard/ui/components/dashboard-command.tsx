import { useRouter } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { Dispatch, SetStateAction, useState } from 'react'

import {
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
	CommandList,
	CommandResponsiveDialog,
} from '@/components/ui'
import { useTRPC } from '@/trpc/client'
import { GenerateAvatar } from '@/components/shared'

interface Props {
	open: boolean
	setOpen: Dispatch<SetStateAction<boolean>>
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
	const trpc = useTRPC()
	const router = useRouter()

	const [search, setSearch] = useState<string>('')

	const agents = useQuery(trpc.agents.getMany.queryOptions({ search, pageSize: 100 }))
	const meetings = useQuery(trpc.meetings.getMany.queryOptions({ search, pageSize: 100 }))

	return (
		<CommandResponsiveDialog shouldFilter={false} open={open} onOpenChange={setOpen}>
			<CommandInput
				placeholder='Find a meeting or agent...'
				value={search}
				onValueChange={(value) => setSearch(value)}
			/>

			<CommandList>
				<CommandGroup heading='Meetings'>
					<CommandEmpty>
						<span className='text-sm text-muted-foreground'>No meetings found</span>
					</CommandEmpty>

					{meetings.data?.items.map((meeting) => (
						<CommandItem
							key={meeting.id}
							onSelect={() => {
								router.push(`/meetings/${meeting.id}`)
								setOpen(false)
							}}
						>
							{meeting.name}
						</CommandItem>
					))}
				</CommandGroup>

				<CommandGroup heading='Agents'>
					<CommandEmpty>
						<span className='text-sm text-muted-foreground'>No agents found</span>
					</CommandEmpty>

					{agents.data?.items.map((agent) => (
						<CommandItem
							key={agent.id}
							onSelect={() => {
								router.push(`/agents/${agent.id}`)
								setOpen(false)
							}}
						>
							<GenerateAvatar seed={agent.name} variant='botttsNeutral' className='size-5' />
							{agent.name}
						</CommandItem>
					))}
				</CommandGroup>
			</CommandList>
		</CommandResponsiveDialog>
	)
}
