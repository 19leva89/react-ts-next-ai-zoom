'use client'

import Link from 'next/link'
import { ChevronRightIcon, TrashIcon, PencilIcon, MoreVerticalIcon } from 'lucide-react'

import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbSeparator,
	Button,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui'

type Props = {
	agentId: string
	agentName: string
	onEdit: () => void
	onRemove: () => void
}

export const AgentIdViewHeader = ({ agentId, agentName, onEdit, onRemove }: Props) => {
	return (
		<div className='flex items-center justify-between'>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink asChild className='text-xl font-medium'>
							<Link href='/agents'>My agents</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>

					<BreadcrumbSeparator className='text-xl font-medium text-foreground [&>svg]:size-4'>
						<ChevronRightIcon />
					</BreadcrumbSeparator>

					<BreadcrumbItem>
						<BreadcrumbLink asChild className='text-xl font-medium text-foreground'>
							<Link href={`/agents/${agentId}`}>{agentName}</Link>
						</BreadcrumbLink>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>

			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button variant='ghost'>
						<MoreVerticalIcon />
					</Button>
				</DropdownMenuTrigger>

				<DropdownMenuContent align='end'>
					<DropdownMenuItem onClick={onEdit} className='cursor-pointer'>
						<PencilIcon className='size-4 text-black' />
						Edit
					</DropdownMenuItem>

					<DropdownMenuItem onClick={onRemove} className='cursor-pointer'>
						<TrashIcon className='size-4 text-black' />
						Delete
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	)
}
