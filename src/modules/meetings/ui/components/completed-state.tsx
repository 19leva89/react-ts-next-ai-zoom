import Link from 'next/link'
import { format } from 'date-fns'
import Markdown from 'react-markdown'
import { BookOpenTextIcon, SparklesIcon, FileTextIcon, FileVideoIcon, ClockFadingIcon } from 'lucide-react'

import { formatDuration } from '@/lib/utils'
import { GeneratedAvatar } from '@/components/shared'
import { MeetingGetOne } from '@/modules/meetings/types'
import { Badge, ScrollArea, ScrollBar, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui'

interface Props {
	data: MeetingGetOne
}

export const CompletedState = ({ data }: Props) => {
	return (
		<div className='flex flex-col gap-y-4'>
			<Tabs className='summary'>
				<div className='rounded-lg border bg-white px-3'>
					<ScrollArea>
						<TabsList className='h-12 justify-start rounded-none bg-background p-0'>
							<TabsTrigger
								value='summary'
								className='h-full rounded-none border border-b-2 border-transparent bg-background text-muted-foreground hover:text-accent-foreground data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground data-[state=active]:shadow-none'
							>
								<BookOpenTextIcon />
								Summary
							</TabsTrigger>

							<TabsTrigger
								value='transcript'
								className='h-full rounded-none border border-b-2 border-transparent bg-background text-muted-foreground hover:text-accent-foreground data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground data-[state=active]:shadow-none'
							>
								<FileTextIcon />
								Transcript
							</TabsTrigger>

							<TabsTrigger
								value='recording'
								className='h-full rounded-none border border-b-2 border-transparent bg-background text-muted-foreground hover:text-accent-foreground data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground data-[state=active]:shadow-none'
							>
								<FileVideoIcon />
								Recording
							</TabsTrigger>

							<TabsTrigger
								value='chat'
								className='h-full rounded-none border border-b-2 border-transparent bg-background text-muted-foreground hover:text-accent-foreground data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground data-[state=active]:shadow-none'
							>
								<SparklesIcon />
								Ask AI
							</TabsTrigger>
						</TabsList>

						<ScrollBar />
					</ScrollArea>
				</div>

				<TabsContent value='recording'>
					<div className='rounded-lg border bg-white px-4 py-5'>
						{data.recordingUrl ? (
							<video src={data.recordingUrl} controls className='w-full rounded-lg' />
						) : (
							<div className='py-4 text-center text-muted-foreground'>No recording available</div>
						)}
					</div>
				</TabsContent>

				<TabsContent value='summary'>
					<div className='rounded-lg border bg-white'>
						<div className='col-span-5 flex flex-col gap-y-5 px-4 py-5'>
							<h2 className='text-2xl font-medium capitalize'>{data.name}</h2>

							<div className='flex items-center gap-x-2'>
								<Link
									href={`/agents/${data.agent.id}`}
									className='flex items-center gap-x-2 capitalize underline underline-offset-4'
								>
									<GeneratedAvatar variant='botttsNeutral' seed={data.agent.name} className='size-5' />
									{data.agent.name}
								</Link>

								<p>{data.startedAt ? format(data.startedAt, 'PPP') : ''}</p>
							</div>

							<div className='flex items-center gap-x-2'>
								<SparklesIcon className='size-4' />

								<p>General summary</p>
							</div>

							<Badge variant='outline' className='flex items-center gap-x-2 [&>svg]:size-4'>
								<ClockFadingIcon className='text-blue-700' />
								{data.duration ? formatDuration(data.duration) : 'No duration'}
							</Badge>

							<div>
								<Markdown
									components={{
										h1: (props) => <h1 className='mb-6 text-2xl font-medium' {...props} />,
										h2: (props) => <h1 className='mb-6 text-xl font-medium' {...props} />,
										h3: (props) => <h1 className='mb-6 text-lg font-medium' {...props} />,
										h4: (props) => <h1 className='mb-6 text-base font-medium' {...props} />,
										p: (props) => <p className='mb-6 leading-relaxed' {...props} />,
										ul: (props) => <ul className='mb-6 list-inside list-disc' {...props} />,
										ol: (props) => <ol className='mb-6 list-inside list-decimal' {...props} />,
										li: (props) => <li className='mb-1' {...props} />,
										strong: (props) => <strong className='font-semibold' {...props} />,
										code: (props) => <code className='rounded bg-gray-100 px-1 py-0.5' {...props} />,
										blockquote: (props) => <blockquote className='my-4 border-l-4 pl-4 italic' {...props} />,
									}}
								>
									{data.summary}
								</Markdown>
							</div>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
