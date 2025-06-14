'use client'

import { toast } from 'sonner'
import { useState } from 'react'
import { VideoIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useSuspenseQuery, useQueryClient, useMutation } from '@tanstack/react-query'

import { Badge } from '@/components/ui'
import { useTRPC } from '@/trpc/client'
import { useConfirm } from '@/hooks/use-confirm'
import { capitalizeFirst } from '@/lib/capitalize-first'
import { ErrorState, GenerateAvatar, LoadingState } from '@/components/shared'
import { UpdateAgentDialog } from '@/modules/agents/ui/components/update-agent-dialog'
import { AgentIdViewHeader } from '@/modules/agents/ui/components/agent-id-view-header'

interface Props {
	agentId: string
}

export const AgentIdView = ({ agentId }: Props) => {
	const trpc = useTRPC()
	const router = useRouter()
	const queryClient = useQueryClient()

	const [updateAgentDialogOpen, setUpdateAgentDialogOpen] = useState<boolean>(false)

	const { data } = useSuspenseQuery(trpc.agents.getOne.queryOptions({ id: agentId }))

	const removeAgent = useMutation(
		trpc.agents.remove.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))
				await queryClient.invalidateQueries(trpc.premium.getFreeUsage.queryOptions())

				router.push('/agents')
			},
			onError: (error) => {
				toast.error(error.message)
			},
		}),
	)

	const [RemoveConfirmation, confirmRemove] = useConfirm(
		'Are you sure?',
		`The following action will remove ${data.meetingCount} associated meetings`,
	)

	const handleRemoveAgent = async () => {
		const ok = await confirmRemove()

		if (!ok) return

		await removeAgent.mutateAsync({ id: agentId })
	}

	return (
		<>
			<div className='flex-1 flex-col gap-y-4 px-4 py-4 md:px-8'>
				<AgentIdViewHeader
					agentId={agentId}
					agentName={data.name}
					onEdit={() => setUpdateAgentDialogOpen(true)}
					onRemove={handleRemoveAgent}
				/>

				<div className='mt-5 rounded-lg border bg-white'>
					<div className='col-span-5 flex flex-col gap-y-5 px-4 py-5'>
						<div className='flex items-center gap-x-3'>
							<GenerateAvatar variant='botttsNeutral' seed={data.name} className='size-10' />

							<h2 className='text-2xl font-medium'>{capitalizeFirst(data.name)}</h2>
						</div>

						<Badge variant='outline' className='flex items-center gap-x-2 [&>svg]:size-4'>
							<VideoIcon className='text-blue-700' />
							{data.meetingCount} {data.meetingCount === 1 ? 'meeting' : 'meetings'}
						</Badge>

						<div className='flex flex-col gap-y-4'>
							<p className='text-lg font-medium'>Instructions</p>

							<p className='text-neutral-800'>{capitalizeFirst(data.instructions)}</p>
						</div>
					</div>
				</div>
			</div>

			<UpdateAgentDialog
				initialValues={data}
				open={updateAgentDialogOpen}
				onOpenChange={setUpdateAgentDialogOpen}
			/>

			<RemoveConfirmation />
		</>
	)
}

export const AgentIdViewLoading = () => {
	return <LoadingState title='Loading agent' description='This may be take a seconds' />
}

export const AgentIdViewError = () => {
	return <ErrorState title='Error loading agent' description='Something went wrong' />
}
