import { AgentGetOne } from '@/modules/agents/types'
import { ResponsiveDialog } from '@/components/shared'
import { AgentForm } from '@/modules/agents/ui/components/agent-form'

type Props = {
	open: boolean
	onOpenChange: (open: boolean) => void
	initialValues: AgentGetOne
}

export default function UpdateAgentDialog({ open, onOpenChange, initialValues }: Props) {
	return (
		<ResponsiveDialog
			title='Edit agent'
			description='Edit the agent details'
			open={open}
			onOpenChange={onOpenChange}
		>
			<AgentForm
				initialValues={initialValues}
				onSuccess={() => onOpenChange(false)}
				onCancel={() => onOpenChange(false)}
			/>
		</ResponsiveDialog>
	)
}
