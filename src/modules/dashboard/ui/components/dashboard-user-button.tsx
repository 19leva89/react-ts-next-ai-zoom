import { useRouter } from 'next/navigation'
import { ChevronDownIcon, CreditCardIcon, LogOutIcon } from 'lucide-react'

import {
	Avatar,
	AvatarImage,
	Button,
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui'
import { authClient } from '@/lib/auth-client'
import { useIsMobile } from '@/hooks/use-mobile'
import { GeneratedAvatar } from '@/components/shared'

export const DashboardUserButton = () => {
	const router = useRouter()
	const isMobile = useIsMobile()

	const { data, isPending } = authClient.useSession()

	if (isPending || !data?.user) {
		return null
	}

	const onLogout = () => {
		authClient.signOut({
			fetchOptions: {
				onSuccess: () => {
					router.push('/sign-in')
				},
			},
		})
	}

	if (isMobile) {
		return (
			<Drawer>
				<DrawerTrigger className='flex w-full items-center justify-between gap-x-2 overflow-hidden rounded-lg border border-border/10 bg-white/5 p-3 hover:bg-white/10'>
					{data.user.image ? (
						<Avatar>
							<AvatarImage src={data.user.image} />
						</Avatar>
					) : (
						<GeneratedAvatar seed={data.user.name} variant='initials' className='mr-3 size-9' />
					)}

					<div className='flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden text-left'>
						<p className='w-full truncate text-sm'>{data.user.name}</p>

						<p className='w-full truncate text-xs'>{data.user.email}</p>
					</div>

					<ChevronDownIcon className='size-4 shrink-0' />
				</DrawerTrigger>

				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>{data.user.name}</DrawerTitle>

						<DrawerDescription>{data.user.email}</DrawerDescription>
					</DrawerHeader>

					<DrawerFooter>
						<Button variant='outline' onClick={() => authClient.customer.portal()}>
							<CreditCardIcon className='size-4 text-black' />
							Billing
						</Button>

						<Button variant='outline' onClick={onLogout}>
							<LogOutIcon className='size-4 text-black' />
							Logout
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		)
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className='flex w-full items-center justify-between gap-x-2 overflow-hidden rounded-lg border border-border/10 bg-white/5 p-3 hover:bg-white/10'>
				{data.user.image ? (
					<Avatar>
						<AvatarImage src={data.user.image} />
					</Avatar>
				) : (
					<GeneratedAvatar seed={data.user.name} variant='initials' className='mr-3 size-9' />
				)}

				<div className='flex min-w-0 flex-1 flex-col gap-0.5 overflow-hidden text-left'>
					<p className='w-full truncate text-sm'>{data.user.name}</p>

					<p className='w-full truncate text-xs'>{data.user.email}</p>
				</div>
				<ChevronDownIcon className='size-4 shrink-0' />
			</DropdownMenuTrigger>

			<DropdownMenuContent align='end' side='right' className='w-72'>
				<DropdownMenuLabel>
					<div className='flex flex-col gap-1'>
						<span className='truncate font-medium'>{data.user.name}</span>

						<span className='truncate text-sm font-normal text-muted-foreground'>{data.user.email}</span>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuItem
					onClick={() => authClient.customer.portal()}
					className='flex cursor-pointer items-center justify-between'
				>
					Billing
					<CreditCardIcon className='size-4' />
				</DropdownMenuItem>

				<DropdownMenuItem className='flex cursor-pointer items-center justify-between' onClick={onLogout}>
					Logout
					<LogOutIcon className='size-4' />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
