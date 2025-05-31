import { useState, JSX } from 'react'

import { Button } from '@/components/ui'
import { ResponsiveDialog } from '@/components/shared'

export const useConfirm = (
	title: string,
	description: string,
): [() => JSX.Element, () => Promise<unknown>] => {
	const [promise, setPromise] = useState<{
		resolve: (value: boolean) => void
	} | null>(null)

	const confirm = () => {
		return new Promise((resolve) => {
			setPromise({ resolve })
		})
	}

	const handleClose = () => {
		setPromise(null)
	}

	const handleConfirm = () => {
		promise?.resolve(true)
		handleClose()
	}

	const handleCancel = () => {
		promise?.resolve(false)
		handleClose()
	}

	const ConfirmationDialog = () => (
		<ResponsiveDialog
			title={title}
			description={description}
			open={promise !== null}
			onOpenChange={handleCancel}
		>
			<div className='flex w-full flex-col-reverse items-center justify-end gap-x-2 gap-y-2 pt-4 lg:flex-row'>
				<Button variant='outline' onClick={handleCancel} className='w-full lg:w-auto'>
					Cancel
				</Button>

				<Button onClick={handleConfirm} className='w-full lg:w-auto'>
					Confirm
				</Button>
			</div>
		</ResponsiveDialog>
	)

	return [ConfirmationDialog, confirm]
}
