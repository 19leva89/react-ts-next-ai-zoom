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
				<DrawerTrigger className="flex items-center justify-between gap-x-2 w-full p-3 border border-border/10 rounded-lg bg-white/5 hover:bg-white/10 overflow-hidden">
					{data.user.image ? (
						<Avatar>
							<AvatarImage src={data.user.image} />
						</Avatar>
					) : (
						<GeneratedAvatar seed={data.user.name} variant="initials" className="size-9 mr-3" />
					)}

					<div className="flex flex-1 flex-col gap-0.5 min-w-0 text-left overflow-hidden">
						<p className="w-full text-sm truncate">{data.user.name}</p>

						<p className="w-full text-xs truncate">{data.user.email}</p>
					</div>

					<ChevronDownIcon className="size-4 shrink-0" />
				</DrawerTrigger>

				<DrawerContent>
					<DrawerHeader>
						<DrawerTitle>{data.user.name}</DrawerTitle>

						<DrawerDescription>{data.user.email}</DrawerDescription>
					</DrawerHeader>

					<DrawerFooter>
						<Button variant="outline" onClick={() => {}}>
							<CreditCardIcon className="size-4 text-black" />
							Billing
						</Button>

						<Button variant="outline" onClick={onLogout}>
							<CreditCardIcon className="size-4 text-black" />
							Log out
						</Button>
					</DrawerFooter>
				</DrawerContent>
			</Drawer>
		)
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="flex items-center justify-between gap-x-2 w-full p-3 border border-border/10 rounded-lg bg-white/5 hover:bg-white/10 overflow-hidden">
				{data.user.image ? (
					<Avatar>
						<AvatarImage src={data.user.image} />
					</Avatar>
				) : (
					<GeneratedAvatar seed={data.user.name} variant="initials" className="size-9 mr-3" />
				)}

				<div className="flex flex-1 flex-col gap-0.5 min-w-0 text-left overflow-hidden">
					<p className="w-full text-sm truncate">{data.user.name}</p>

					<p className="w-full text-xs truncate">{data.user.email}</p>
				</div>
				<ChevronDownIcon className="size-4 shrink-0" />
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" side="right" className="w-72">
				<DropdownMenuLabel>
					<div className="flex flex-col gap-1">
						<span className="font-medium truncate">{data.user.name}</span>

						<span className="text-sm font-normal text-muted-foreground truncate">{data.user.email}</span>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuItem className="flex items-center justify-between cursor-pointer">
					Billing
					<CreditCardIcon className="size-4" />
				</DropdownMenuItem>

				<DropdownMenuItem className="flex items-center justify-between cursor-pointer" onClick={onLogout}>
					Logout
					<LogOutIcon className="size-4" />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
