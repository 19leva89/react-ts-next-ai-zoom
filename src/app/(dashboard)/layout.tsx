import { PropsWithChildren } from 'react'

import { SidebarProvider } from '@/components/ui'
import { DashboardNavbar } from '@/modules/dashboard/ui/components/dashboard-navbar'
import { DashboardSidebar } from '@/modules/dashboard/ui/components/dashboard-sidebar'

const DashboardLayout = ({ children }: PropsWithChildren) => {
	return (
		<SidebarProvider>
			<DashboardSidebar />

			<main className='flex h-screen w-screen flex-col bg-muted'>
				<DashboardNavbar />

				{children}
			</main>
		</SidebarProvider>
	)
}

export default DashboardLayout
