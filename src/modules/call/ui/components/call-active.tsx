'use client'

import Link from 'next/link'
import Image from 'next/image'
import { CallControls, SpeakerLayout } from '@stream-io/video-react-sdk'

interface Props {
	meetingName: string
	onLeave: () => void
}

export const CallActive = ({ meetingName, onLeave }: Props) => (
	<div className='flex h-full flex-col justify-between p-4 text-white'>
		<div className='flex items-center gap-4 rounded-full bg-[#101213] p-4'>
			<Link href='/' className='flex w-fit items-center justify-center rounded-full bg-white p-1'>
				<Image src='/svg/logo.svg' alt='logo' width={22} height={22} />
			</Link>

			<h4 className='text-base'>{meetingName}</h4>
		</div>

		<SpeakerLayout />

		<div className='gap-4 rounded-full bg-[#101213] p-4'>
			<CallControls onLeave={onLeave} />
		</div>
	</div>
)
