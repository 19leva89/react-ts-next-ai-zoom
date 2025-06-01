'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQueryClient, useSuspenseQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { useConfirm } from '@/hooks/use-confirm'
import { ErrorState, LoadingState } from '@/components/shared'
import { ActiveState } from '@/modules/meetings/ui/components/active-state'
import { UpcomingState } from '@/modules/meetings/ui/components/upcoming-state'
import { CancelledState } from '@/modules/meetings/ui/components/cancelled-state'
import { ProcessingState } from '@/modules/meetings/ui/components/processing-state'
import { UpdateMeetingDialog } from '@/modules/meetings/ui/components/update-meeting-dialog'
import { MeetingIdViewHeader } from '@/modules/meetings/ui/components/meeting-id-view-header'

type Props = {
	meetingId: string
}

export const MeetingIdView = ({ meetingId }: Props) => {
	const router = useRouter()
	const trpc = useTRPC()

	const [updateMeetingDialogOpen, setUpdateMeetingDialogOpen] = useState<boolean>(false)

	const queryClient = useQueryClient()
	const { data } = useSuspenseQuery(trpc.meetings.getOne.queryOptions({ id: meetingId }))

	const removeMeeting = useMutation(
		trpc.meetings.remove.mutationOptions({
			onSuccess: () => {
				queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}))

				router.push('/meetings')
			},
			onError: (error) => {
				toast.error(error.message)
			},
		}),
	)

	const [RemoveConfirmation, confirmRemove] = useConfirm(
		'Are you sure?',
		'The following action will remove this meeting',
	)

	const handleRemoveMeeting = async () => {
		const ok = await confirmRemove()

		if (!ok) return

		await removeMeeting.mutateAsync({ id: meetingId })
	}

	const isActive = data.status === 'active'
	const isUpcoming = data.status === 'upcoming'
	const isCancelled = data.status === 'cancelled'
	const isCompleted = data.status === 'completed'
	const isProcessing = data.status === 'processing'

	return (
		<>
			<RemoveConfirmation />

			<UpdateMeetingDialog
				open={updateMeetingDialogOpen}
				onOpenChange={setUpdateMeetingDialogOpen}
				initialValues={data}
			/>

			<div className='flex flex-1 flex-col gap-y-4 px-4 py-4 md:px-8'>
				<MeetingIdViewHeader
					meetingId={meetingId}
					meetingName={data.name}
					onEdit={() => setUpdateMeetingDialogOpen(true)}
					onRemove={handleRemoveMeeting}
				/>

				{isCancelled && <CancelledState />}

				{isCompleted && <div>Completed</div>}

				{isProcessing && <ProcessingState />}

				{isActive && <ActiveState meetingId={meetingId} />}

				{isUpcoming && (
					<UpcomingState meetingId={meetingId} onCancelMeeting={() => {}} isCancelling={false} />
				)}
			</div>
		</>
	)
}

export const MeetingIdViewLoading = () => {
	return <LoadingState title='Loading meeting' description='This may be take a seconds' />
}

export const MeetingIdViewError = () => {
	return <ErrorState title='Error loading meeting' description='Something went wrong' />
}
