import { NextResponse } from 'next/server'
import { and, eq, not } from 'drizzle-orm'
import { CallSessionStartedEvent } from '@stream-io/node-sdk'

import { db } from '@/db'
import { agents } from '@/db/schema/agents'
import { meetings } from '@/db/schema/meetings'
import { streamVideo } from '@/lib/stream-video'

export const handleCallSessionStarted = async (event: CallSessionStartedEvent) => {
	const meetingId = event.call.custom?.meetingId
	if (!meetingId) return NextResponse.json({ error: 'Missing meetingId' }, { status: 400 })

	const [existingMeeting] = await db
		.select()
		.from(meetings)
		.where(
			and(
				eq(meetings.id, meetingId),
				not(eq(meetings.status, 'completed')),
				not(eq(meetings.status, 'active')),
				not(eq(meetings.status, 'cancelled')),
				not(eq(meetings.status, 'processing')),
			),
		)

	if (!existingMeeting) return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })

	await db
		.update(meetings)
		.set({
			status: 'active',
			startedAt: new Date(),
		})
		.where(eq(meetings.id, meetingId))

	const [existingAgent] = await db.select().from(agents).where(eq(agents.id, existingMeeting.agentId))
	if (!existingAgent) return NextResponse.json({ error: 'Agent not found' }, { status: 404 })

	const call = streamVideo.video.call('default', meetingId)
	const realtimeClient = await streamVideo.video.connectOpenAi({
		call,
		openAiApiKey: process.env.OPENAI_API_KEY!,
		agentUserId: existingAgent.id,
	})

	await realtimeClient.updateSession({ instructions: existingAgent.instructions })

	return NextResponse.json({ status: 'ok' })
}
