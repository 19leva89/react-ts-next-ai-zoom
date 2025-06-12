import { CircleCheckIcon } from 'lucide-react'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'
import { Badge, Button, Separator } from '@/components/ui'

const pricingCardVariants = cva('w-full rounded-lg p-4 py-6', {
	variants: {
		variant: {
			default: 'bg-white text-black',
			highlighted: 'bg-linear-to-b from-[#093C23] to-[#051B16] text-white',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

const pricingCardIconVariants = cva('size-5', {
	variants: {
		variant: {
			default: 'fill-primary text-white',
			highlighted: 'fill-white text-black',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

const pricingCardSecondaryTextVariants = cva('text-neutral-700', {
	variants: {
		variant: {
			default: 'text-neutral-700',
			highlighted: 'text-neutral-300',
		},
	},
})

const pricingCardBadgeVariants = cva('p-1 text-xs font-normal text-black', {
	variants: {
		variant: {
			default: 'bg-primary/20',
			highlighted: 'bg-[#F5B797]',
		},
	},
	defaultVariants: {
		variant: 'default',
	},
})

interface Props extends VariantProps<typeof pricingCardVariants> {
	title: string
	price: number
	priceSuffix: string
	features: string[]
	buttonText: string
	badge?: string | null
	description?: string | null
	className?: string
	onClick: () => void
}

export const PricingCard = ({
	variant,
	title,
	price,
	priceSuffix,
	features,
	buttonText,
	badge,
	description,
	className,
	onClick,
}: Props) => {
	return (
		<div className={cn(pricingCardVariants({ variant }), className, 'border')}>
			<div className='flex items-end justify-between gap-x-4'>
				<div className='flex flex-col gap-y-2'>
					<div className='flex items-center gap-x-2'>
						<h6 className='text-xl font-medium'>{title}</h6>

						{badge ? <Badge className={cn(pricingCardBadgeVariants({ variant }))}>{badge}</Badge> : null}
					</div>

					<p className={cn(pricingCardSecondaryTextVariants({ variant }))}>{description}</p>
				</div>

				<div className='flex shrink-0 items-end gap-x-0.5'>
					<h4 className='text-3xl font-medium'>
						{Intl.NumberFormat('en-US', {
							style: 'currency',
							currency: 'USD',
							minimumFractionDigits: 0,
						}).format(price)}
					</h4>

					<span className={cn(pricingCardSecondaryTextVariants({ variant }))}>{priceSuffix}</span>
				</div>
			</div>

			<div className='py-6'>
				<Separator className='text-[#5D6B68] opacity-10' />
			</div>

			<Button
				variant={variant === 'highlighted' ? 'default' : 'outline'}
				size='lg'
				onClick={onClick}
				className='w-full'
			>
				{buttonText}
			</Button>

			<div className='mt-6 flex flex-col gap-y-2'>
				<p className='font-medium uppercase'>Features</p>

				<ul className={cn('flex flex-col gap-y-2.5', pricingCardSecondaryTextVariants({ variant }))}>
					{features.map((feature, index) => (
						<li key={index} className='flex items-center gap-x-2.5'>
							<CircleCheckIcon className={cn(pricingCardIconVariants({ variant }))} />

							{feature}
						</li>
					))}
				</ul>
			</div>
		</div>
	)
}
