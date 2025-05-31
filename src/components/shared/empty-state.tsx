import Image from 'next/image'

interface Props {
	title: string
	description: string
}

export const EmptyState = ({ title, description }: Props) => {
	return (
		<div className='flex flex-col items-center justify-center'>
			<Image src='/svg/empty.svg' alt='Empty' height={240} width={240} />

			<div className='mx-auto flex max-w-md flex-col gap-y-6 text-center'>
				<h6 className='text-lg font-medium'>{title}</h6>

				<p className='text-sm text-muted-foreground'>{description}</p>
			</div>
		</div>
	)
}
