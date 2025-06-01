import { InfoState } from '@/components/shared'

export const CancelledState = () => {
	return (
		<div className='flex flex-col items-center justify-center gap-y-8 rounded-lg bg-white px-4 py-5'>
			<InfoState
				title='Meeting cancelled'
				description='This meeting was cancelled'
				image='/svg/cancelled.svg'
				imageAlt='Cancelled'
			/>
		</div>
	)
}
