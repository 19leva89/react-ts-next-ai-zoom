import Link from 'next/link'
import { VideoIcon, BanIcon } from 'lucide-react'

import { Button } from '@/components/ui'
import { InfoState } from '@/components/shared'

interface Props {
	meetingId: string
	isCancelling: boolean
	onCancelMeeting: () => void
}

export const UpcomingState = ({ meetingId, isCancelling, onCancelMeeting }: Props) => {
	return (
		<div className='flex flex-col items-center justify-center gap-y-8 rounded-lg bg-white px-4 py-5'>
			<InfoState
				title='Not started yet'
				description='Once you start this meeting, a summary will appear here'
				image='/svg/upcoming.svg'
				imageAlt='Upcoming'
			/>

			<div className='flex w-full flex-col-reverse items-center gap-2 lg:flex-row lg:justify-center'>
				<Button
					variant='secondary'
					disabled={isCancelling}
					onClick={onCancelMeeting}
					className='w-full lg:w-auto'
				>
					<BanIcon />
					Cancel meeting
				</Button>

				<Button asChild disabled={isCancelling} className='w-full lg:w-auto'>
					<Link href={`/call/${meetingId}`}>
						<VideoIcon />
						Start meeting
					</Link>
				</Button>
			</div>
		</div>
	)
}
