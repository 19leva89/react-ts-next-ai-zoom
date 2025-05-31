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

			<nav className='bg-background flex items-center gap-x-2 border-b px-4 py-3'>
				<Button variant='outline' onClick={toggleSidebar} className='size-9'>
					{state === 'collapsed' || isMobile ? (
						<PanelLeftIcon className='size-4' />
					) : (
						<PanelLeftCloseIcon className='size-4' />
					)}
				</Button>

				<Button
					variant='outline'
					size='sm'
					onClick={() => setCommandOpen((open) => !open)}
					className='text-muted-foreground hover:text-muted-foreground h-9 w-60 justify-start font-normal'
				>
					<SearchIcon />
					Search
					<kbd className='bg-muted text-muted-foreground pointer-events-none ml-auto inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px] font-medium select-none'>
						<span className='text-sm'>&#8984;</span>K
					</kbd>
				</Button>
			</nav>
		</>
	)
}
