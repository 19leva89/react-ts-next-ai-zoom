'use client'

import { ColumnDef } from '@tanstack/react-table'
import { CornerDownRightIcon, VideoIcon } from 'lucide-react'

import { Badge } from '@/components/ui'
import { AgentGetOne } from '@/modules/agents/types'
import { GeneratedAvatar } from '@/components/shared'

export const columns: ColumnDef<AgentGetOne>[] = [
	{
		accessorKey: 'name',
		header: 'Agent name',
		cell: ({ row }) => (
			<div className='flex flex-col gap-y-1'>
				<div className='flex items-center gap-x-2'>
					<GeneratedAvatar variant='botttsNeutral' seed={row.original.name} className='size-6' />

					<span className='font-semibold'>
						{row.original.name.charAt(0).toUpperCase() + row.original.name.slice(1)}
					</span>
				</div>

				<div className='flex items-center gap-x-2'>
					<CornerDownRightIcon className='size-3 text-muted-foreground' />

					<span className='max-w-50 truncate text-sm text-muted-foreground'>
						{row.original.instructions.charAt(0).toUpperCase() + row.original.instructions.slice(1)}
					</span>
				</div>
			</div>
		),
	},
	{
		accessorKey: 'meetingCount',
		header: 'Meetings',
		cell: ({ row }) => (
			<Badge variant='outline' className='flex items-center gap-x-2 [&>svg]:size-4'>
				<VideoIcon className='text-blue-700' />
				{row.original.meetingCount} {row.original.meetingCount === 1 ? 'meeting' : 'meetings'}
			</Badge>
		),
	},
]
