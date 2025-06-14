import { z } from 'zod'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
	Button,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
	Textarea,
} from '@/components/ui'
import { useTRPC } from '@/trpc/client'
import { AgentGetOne } from '@/modules/agents/types'
import { GenerateAvatar } from '@/components/shared'
import { agentsInsertSchema } from '@/modules/agents/schema'

interface Props {
	onSuccess?: () => void
	onCancel?: () => void
	initialValues?: AgentGetOne
}

export const AgentForm = ({ onCancel, onSuccess, initialValues }: Props) => {
	const trpc = useTRPC()
	const router = useRouter()
	const queryClient = useQueryClient()

	const createAgent = useMutation(
		trpc.agents.create.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))
				await queryClient.invalidateQueries(trpc.premium.getFreeUsage.queryOptions())

				onSuccess?.()
			},
			onError: (error) => {
				toast.error(error.message)

				if (error.data?.code === 'FORBIDDEN') {
					router.push('/upgrade')
				}
			},
		}),
	)

	const updateAgent = useMutation(
		trpc.agents.update.mutationOptions({
			onSuccess: async () => {
				await queryClient.invalidateQueries(trpc.agents.getMany.queryOptions({}))

				if (initialValues?.id) {
					await queryClient.invalidateQueries(trpc.agents.getOne.queryOptions({ id: initialValues.id }))
				}

				onSuccess?.()
			},
			onError: (error) => {
				toast.error(error.message)
			},
		}),
	)

	const form = useForm<z.infer<typeof agentsInsertSchema>>({
		resolver: zodResolver(agentsInsertSchema),
		defaultValues: {
			name: initialValues?.name ?? '',
			instructions: initialValues?.instructions ?? '',
		},
	})

	const isEdit = !!initialValues?.id
	const isPending = createAgent.isPending || updateAgent.isPending

	const onSubmit = (values: z.infer<typeof agentsInsertSchema>) => {
		if (isEdit) {
			updateAgent.mutate({ ...values, id: initialValues.id })
		} else {
			createAgent.mutate(values)
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
				<GenerateAvatar seed={form.watch('name')} variant='botttsNeutral' className='size-16 border' />

				<FormField
					name='name'
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>

							<FormControl>
								<Input {...field} placeholder='e.g. Math tutor' />
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name='instructions'
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Instructions</FormLabel>

							<FormControl>
								<Textarea
									{...field}
									placeholder='You are a helpful math assistant that can answer questions and help with assignments'
								/>
							</FormControl>

							<FormMessage />
						</FormItem>
					)}
				/>

				<div className='flex justify-between gap-x-2'>
					{onCancel && (
						<Button variant='ghost' type='button' disabled={isPending} onClick={() => onCancel()}>
							Cancel
						</Button>
					)}

					<Button type='submit' disabled={isPending}>
						{isEdit ? 'Update' : 'Create'}
					</Button>
				</div>
			</form>
		</Form>
	)
}
