import { useState } from 'react'
import { format } from 'date-fns'
import { SearchIcon } from 'lucide-react'
import Highlighter from 'react-highlight-words'
import { useQuery } from '@tanstack/react-query'

import { useTRPC } from '@/trpc/client'
import { generatedAvatarUri } from '@/lib/avatar'
import { Avatar, AvatarImage, Input, ScrollArea } from '@/components/ui'

interface Props {
	meetingId: string
}

export const Transcript = ({ meetingId }: Props) => {
	const trpc = useTRPC()

	const { data } = useQuery(trpc.meetings.getTranscript.queryOptions({ id: meetingId }))

	const [searchQuery, setSearchQuery] = useState<string>('')

	const filteredData = (data ?? []).filter((item) =>
		item.text.toString().toLowerCase().includes(searchQuery.toLowerCase()),
	)

	return (
		<div className='flex w-full flex-col gap-y-4 rounded-lg border bg-white px-4 py-5'>
			<p className='text-sm font-medium'>Transcript</p>

			<div className='relative w-64'>
				<Input
					placeholder='Search transcript'
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
					className='h-9 bg-white pl-7'
				/>

				<SearchIcon className='absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted-foreground' />
			</div>

			<ScrollArea>
				<div className='flex flex-col gap-y-4'>
					{filteredData.map((item) => (
						<div key={item.start_ts} className='flex flex-col gap-y-2 rounded-md border p-4 hover:bg-muted'>
							<div className='flex items-center gap-x-2'>
								<Avatar className='size-6'>
									<AvatarImage
										src={item.user.image ?? generatedAvatarUri({ seed: item.user.name, variant: 'initials' })}
										alt='User avatar'
									/>
								</Avatar>

								<p className='text-sm font-medium'>{item.user.name}</p>

								<p className='text-sm font-medium text-blue-500'>
									{format(new Date(0, 0, 0, 0, 0, item.start_ts), 'mm:ss')}
								</p>
							</div>

							<Highlighter
								searchWords={[searchQuery]}
								autoEscape={true}
								textToHighlight={item.text}
								className='text-sm text-neutral-700'
								highlightClassName='bg-yellow-200'
							/>
						</div>
					))}
				</div>
			</ScrollArea>
		</div>
	)
}
