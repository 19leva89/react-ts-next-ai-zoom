import { ResponsiveDialog } from '@/components/shared'
import { MeetingGetOne } from '@/modules/meetings/types'
import { MeetingForm } from '@/modules/meetings/ui/components/meeting-form'

interface Props {
	initialValues: MeetingGetOne
	open: boolean
	onOpenChange: (open: boolean) => void
}

export const UpdateMeetingDialog = ({ initialValues, open, onOpenChange }: Props) => {
	return (
		<ResponsiveDialog
			title='Edit meeting'
			description='Edit the meeting details'
			open={open}
			onOpenChange={onOpenChange}
		>
			<MeetingForm
				initialValues={initialValues}
				onSuccess={() => onOpenChange(false)}
				onCancel={() => onOpenChange(false)}
			/>
		</ResponsiveDialog>
	)
}
