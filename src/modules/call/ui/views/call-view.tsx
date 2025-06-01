'use client'

import { useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { ErrorState } from '@/components/shared'
import { CallProvider } from '@/modules/call/ui/components/call-provider'

interface Props {
	meetingId: string
}

export const CallView = ({ meetingId }: Props) => {
	const trpc = useTRPC()

	const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }))

	if (data.status === 'completed') {
		return (
			<div className='flex h-screen items-center justify-between'>
				<ErrorState title='Meeting has ended' description='You can no longer join this meeting' />
			</div>
		)
	}

	return <CallProvider meetingId={meetingId} meetingName={data.name} />
}
