import { InfoState } from '@/components/shared'

export const ProcessingState = () => {
	return (
		<div className='flex flex-col items-center justify-center gap-y-8 rounded-lg bg-white px-4 py-5'>
			<InfoState
				title='Meeting completed'
				description='This meeting was completed, a summary will appear soon'
				image='/svg/processing.svg'
				imageAlt='Processing'
			/>
		</div>
	)
}
