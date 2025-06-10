import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { MessageNewEvent } from '@stream-io/node-sdk'

import { db } from '@/db'
import { agents } from '@/db/schema/agents'
import { streamChat } from '@/lib/stream-chat'
import { meetings } from '@/db/schema/meetings'
import { generateAvatarUri } from '@/lib/avatar'
import { openaiClient } from '@/lib/openai-client'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'
import { CHAT_ASSISTANT_PROMPT } from '@/modules/meetings/constants/chat-prompts'

export const handleMessageNew = async (event: MessageNewEvent) => {
	const userId = event.user?.id
	const channelId = event.channel_id
	const text = event.message?.text

	if (!userId || !channelId || !text)
		return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

	const [existingMeeting] = await db
		.select()
		.from(meetings)
		.where(and(eq(meetings.id, channelId), eq(meetings.status, 'completed')))

	if (!existingMeeting) return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })

	const [existingAgent] = await db.select().from(agents).where(eq(agents.id, existingMeeting.agentId))

	if (!existingAgent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

	if (userId !== existingAgent.id) {
		const instructions = CHAT_ASSISTANT_PROMPT.replace(
			'{meetingSummary}',
			existingMeeting.summary || 'No summary available',
		).replace('{agentInstructions}', existingAgent.instructions)

		const channel = streamChat.channel('messaging', channelId)

		await channel.watch()

		const previousMessages = channel.state.messages
			.slice(-5)
			.filter((msg) => msg.text && msg.text.trim() !== '')
			.map<ChatCompletionMessageParam>((msg) => ({
				role: msg.user?.id === existingAgent.id ? 'assistant' : 'user',
				content: msg.text || '',
			}))

		const GPTResponse = await openaiClient.chat.completions.create({
			model: 'gpt-4o',
			messages: [
				{
					role: 'system',
					content: instructions,
				},
				...previousMessages,
				{
					role: 'user',
					content: text,
				},
			],
		})

		const GPTResponseText = GPTResponse.choices?.[0]?.message?.content

		if (!GPTResponseText) {
			return NextResponse.json({ error: 'No response from GPT' }, { status: 400 })
		}

		const avatarUrl = generateAvatarUri({
			seed: existingAgent.name,
			variant: 'botttsNeutral',
		})

		await streamChat.upsertUser({
			id: existingAgent.id,
			name: existingAgent.name,
			image: avatarUrl,
		})

		await channel.sendMessage({
			text: GPTResponseText,
			user: {
				id: existingAgent.id,
				name: existingAgent.name,
				image: avatarUrl,
			},
		})
	}

	return NextResponse.json({ status: 'ok' })
}
