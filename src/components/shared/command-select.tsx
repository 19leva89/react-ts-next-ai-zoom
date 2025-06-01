import { useState, ReactNode } from 'react'
import { ChevronsUpDownIcon } from 'lucide-react'

import {
	Button,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
	CommandResponsiveDialog,
} from '@/components/ui'
import { cn } from '@/lib/utils'

type Props = {
	options: Array<{
		id: string
		value: string
		children: ReactNode
	}>
	value: string
	placeholder?: string
	className?: string
	onSelect: (value: string) => void
	onSearch?: (value: string) => void
}

export const CommandSelect = ({
	options,
	value,
	placeholder = 'Select an option',
	className,
	onSelect,
	onSearch,
}: Props) => {
	const [open, setOpen] = useState<boolean>(false)

	const selectedOption = options.find((option) => option.value === value)

	const handleOpenChange = (open: boolean) => {
		onSearch?.('')
		setOpen(open)
	}

	return (
		<>
			<Button
				variant='outline'
				type='button'
				onClick={() => setOpen(true)}
				className={cn(
					'h-9 justify-between px-2 font-normal',
					!selectedOption && 'text-muted-foreground',
					className,
				)}
			>
				<div>{selectedOption?.children ?? placeholder}</div>

				<ChevronsUpDownIcon />
			</Button>

			<CommandResponsiveDialog open={open} onOpenChange={handleOpenChange} shouldFilter={!onSearch}>
				<CommandInput placeholder='Search...' onValueChange={onSearch} />

				<CommandList>
					<CommandEmpty>
						<span className='text-sm text-muted-foreground'>No options found</span>
					</CommandEmpty>

					{options.map((option) => (
						<CommandItem
							key={option.id}
							onSelect={() => {
								onSelect(option.value)
								setOpen(false)
							}}
							className='cursor-pointer'
						>
							{option.children}
						</CommandItem>
					))}
				</CommandList>
			</CommandResponsiveDialog>
		</>
	)
}
