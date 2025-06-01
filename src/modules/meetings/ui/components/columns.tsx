'use client'

import {
	CircleCheckIcon,
	CircleXIcon,
	ClockArrowUpIcon,
	ClockFadingIcon,
	CornerDownRightIcon,
	LoaderIcon,
} from 'lucide-react'
import { format } from 'date-fns'
import humanizeDuration from 'humanize-duration'
import { ColumnDef } from '@tanstack/react-table'

import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui'
import { GeneratedAvatar } from '@/components/shared'
import { capitalizeFirst } from '@/lib/capitalize-first'
import { MeetingGetMany } from '@/modules/meetings/types'

function formatDuration(seconds: number) {
	return humanizeDuration(seconds * 1000, {
		largest: 1,
		round: true,
		units: ['h', 'm', 's'],
	})
}

const statusIconMap = {
	upcoming: ClockArrowUpIcon,
	active: ClockFadingIcon,
	completed: CircleCheckIcon,
	processing: LoaderIcon,
	cancelled: CircleXIcon,
}

const statusColorMap = {
	upcoming: 'bg-yellow-500/20 text-yellow-800 border-yellow-800/5',
	active: 'bg-blue-500/20 text-blue-800 border-blue-800/5',
	completed: 'bg-emerald-500/20 text-emerald-800 border-emerald-800/5',
	processing: 'bg-gray-500/20 text-gray-800 border-gray-800/5',
	cancelled: 'bg-rose-500/20 text-rose-800 border-rose-800/5',
}

export const columns: ColumnDef<MeetingGetMany[number]>[] = [
	{
		accessorKey: 'name',
		header: 'Meeting name',
		cell: ({ row }) => (
			<div className='flex flex-col gap-y-1'>
				<span className='font-semibold'>{capitalizeFirst(row.original.name)}</span>

				<div className='flex items-center gap-x-2'>
					<div className='flex items-center gap-x-1'>
						<CornerDownRightIcon className='size-3 text-muted-foreground' />

						<span className='max-w-50 truncate text-sm text-muted-foreground'>
							{capitalizeFirst(row.original.agent.name)}
						</span>
					</div>

					<GeneratedAvatar variant='botttsNeutral' seed={row.original.agent.name} className='size-4' />

					<span className='text-sm text-muted-foreground'>
						{row.original.startedAt ? format(row.original.startedAt, 'MMM d') : ''}
					</span>
				</div>
			</div>
		),
	},
	{
		accessorKey: 'status',
		header: 'Status',
		cell: ({ row }) => {
			const Icon = statusIconMap[row.original.status as keyof typeof statusIconMap]

			return (
				<Badge
					variant='outline'
					className={cn(
						'text-muted-foreground [&>svg]:size-4',
						statusColorMap[row.original.status as keyof typeof statusColorMap],
					)}
				>
					<Icon className={cn(row.original.status === 'processing' && 'animate-spin')} />

					{capitalizeFirst(row.original.status)}
				</Badge>
			)
		},
	},
	{
		accessorKey: 'duration',
		header: 'Duration',
		cell: ({ row }) => (
			<Badge variant='outline' className='[&>svg]:size-4'>
				<ClockFadingIcon className='text-blue-700' />

				{capitalizeFirst(row.original.duration ? formatDuration(row.original.duration) : 'No duration')}
			</Badge>
		),
	},
]
