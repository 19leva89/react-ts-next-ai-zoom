import { and, eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { MessageNewEvent } from '@stream-io/node-sdk'

import { db } from '@/db'
import { agents } from '@/db/schema/agents'
import { streamChat } from '@/lib/stream-chat'
import { meetings } from '@/db/schema/meetings'
import { generatedAvatarUri } from '@/lib/avatar'
import { openaiClient } from '@/lib/openai-client'
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs'

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
		const instructions = `
      You are an AI assistant helping the user revisit a recently completed meeting.
      Below is a summary of the meeting, generated from the transcript:
      
      ${existingMeeting.summary}
      
      The following are your original instructions from the live meeting assistant. Please continue to follow these behavioral guidelines as you assist the user:
      
      ${existingAgent.instructions}
      
      The user may ask questions about the meeting, request clarifications, or ask for follow-up actions.
      Always base your responses on the meeting summary above.
      
      You also have access to the recent conversation history between you and the user. Use the context of previous messages to provide relevant, coherent, and helpful responses. If the user's question refers to something discussed earlier, make sure to take that into account and maintain continuity in the conversation.
      
      If the summary does not contain enough information to answer a question, politely let the user know.
      
      Be concise, helpful, and focus on providing accurate information from the meeting and the ongoing conversation.
      `

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

		const GPTResponseText = GPTResponse.choices[0].message.content

		if (!GPTResponseText) {
			return NextResponse.json({ error: 'No response from GPT' }, { status: 400 })
		}

		const avatarUrl = generatedAvatarUri({
			seed: existingAgent.name,
			variant: 'botttsNeutral',
		})

		streamChat.upsertUser({
			id: existingAgent.id,
			name: existingAgent.name,
			image: avatarUrl,
		})

		channel.sendMessage({
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
