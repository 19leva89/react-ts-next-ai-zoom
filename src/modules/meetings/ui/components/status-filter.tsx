'use client'

import { CircleCheckIcon, CircleXIcon, ClockArrowUpIcon, LoaderIcon, VideoIcon } from 'lucide-react'

import { CommandSelect } from '@/components/shared'
import { MeetingStatus } from '@/modules/meetings/types'
import { useMeetingsFilters } from '@/modules/meetings/hooks/use-meetings-filters'

const options = [
	{
		id: MeetingStatus.Upcoming,
		value: MeetingStatus.Upcoming,
		children: (
			<div className='flex items-center gap-x-2 capitalize'>
				<ClockArrowUpIcon />
				{MeetingStatus.Upcoming}
			</div>
		),
	},
	{
		id: MeetingStatus.Completed,
		value: MeetingStatus.Completed,
		children: (
			<div className='flex items-center gap-x-2 capitalize'>
				<CircleCheckIcon />
				{MeetingStatus.Completed}
			</div>
		),
	},
	{
		id: MeetingStatus.Active,
		value: MeetingStatus.Active,
		children: (
			<div className='flex items-center gap-x-2 capitalize'>
				<VideoIcon />
				{MeetingStatus.Active}
			</div>
		),
	},
	{
		id: MeetingStatus.Processing,
		value: MeetingStatus.Processing,
		children: (
			<div className='flex items-center gap-x-2 capitalize'>
				<LoaderIcon />
				{MeetingStatus.Processing}
			</div>
		),
	},
	{
		id: MeetingStatus.Cancelled,
		value: MeetingStatus.Cancelled,
		children: (
			<div className='flex items-center gap-x-2 capitalize'>
				<CircleXIcon />
				{MeetingStatus.Cancelled}
			</div>
		),
	},
]

export const StatusFilter = () => {
	const [filters, setFilters] = useMeetingsFilters()

	return (
		<CommandSelect
			placeholder='Status'
			value={filters.status ?? ''}
			options={options}
			onSelect={(value) => setFilters({ status: value as MeetingStatus })}
			className='h-9'
		/>
	)
}
