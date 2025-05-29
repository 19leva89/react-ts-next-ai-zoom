'use client'

import { useEffect, useState } from 'react'
import { PanelLeftCloseIcon, PanelLeftIcon, SearchIcon } from 'lucide-react'

import { Button, useSidebar } from '@/components/ui'
import { DashboardCommand } from '@/modules/dashboard/ui/components/dashboard-command'

export const DashboardNavbar = () => {
	const { state, toggleSidebar, isMobile } = useSidebar()

	const [commandOpen, setCommandOpen] = useState<boolean>(false)

	useEffect(() => {
		const down = (e: KeyboardEvent) => {
			if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
				e.preventDefault()
				setCommandOpen((open) => !open)
			}
		}
		document.addEventListener('keydown', down)
		return () => document.removeEventListener('keydown', down)
	}, [])

	return (
		<>
			<DashboardCommand open={commandOpen} setOpen={setCommandOpen} />

			<nav className="flex items-center gap-x-2 px-4 py-3 border-b bg-background">
				<Button variant="outline" onClick={toggleSidebar} className="size-9">
					{state === 'collapsed' || isMobile ? (
						<PanelLeftIcon className="size-4" />
					) : (
						<PanelLeftCloseIcon className="size-4" />
					)}
				</Button>

				<Button
					variant="outline"
					size="sm"
					onClick={() => setCommandOpen((open) => !open)}
					className="justify-start h-9 w-60 font-normal text-muted-foreground hover:text-muted-foreground"
				>
					<SearchIcon />
					Search
					<kbd className="inline-flex items-center gap-1 h-5 px-1.5 ml-auto border rounded pointer-events-none select-none bg-muted font-mono text-[10px] font-medium text-muted-foreground">
						<span className="text-sm">&#8984;</span>K
					</kbd>
				</Button>
			</nav>
		</>
	)
}
