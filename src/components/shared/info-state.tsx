import Image from 'next/image'

interface Props {
	title: string
	description: string
	image: string
	imageAlt: string
}

export const InfoState = ({ title, description, image, imageAlt }: Props) => {
	return (
		<div className='flex flex-col items-center justify-center'>
			<Image src={image} alt={imageAlt} height={240} width={240} />

			<div className='mx-auto flex max-w-md flex-col gap-y-6 text-center'>
				<h6 className='text-lg font-medium'>{title}</h6>

				<p className='text-sm text-muted-foreground'>{description}</p>
			</div>
		</div>
	)
}
