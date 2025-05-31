import { ResponsiveDialog } from '@/components/shared'
import { AgentForm } from '@/modules/agents/ui/components/agent-form'

interface Props {
	open: boolean
	onOpenChange: (open: boolean) => void
}

export const NewAgentDialog = ({ open, onOpenChange }: Props) => {
	return (
		<ResponsiveDialog
			title='New agent'
			description='Create a new agent'
			open={open}
			onOpenChange={onOpenChange}
		>
			<AgentForm onSuccess={() => onOpenChange(false)} onCancel={() => onOpenChange(false)} />
		</ResponsiveDialog>
	)
}
