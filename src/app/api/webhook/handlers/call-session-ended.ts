import { eq, and } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { CallEndedEvent } from '@stream-io/node-sdk'

import { db } from '@/db'
import { meetings } from '@/db/schema/meetings'

export const handleCallSessionEnded = async (event: CallEndedEvent) => {
	const meetingId = event.call.custom?.meetingId
	if (!meetingId) return NextResponse.json({ error: 'Missing meetingId' }, { status: 400 })

	await db
		.update(meetings)
		.set({
			status: 'processing',
			endedAt: new Date(),
		})
		.where(and(eq(meetings.id, meetingId), eq(meetings.status, 'active')))

	return NextResponse.json({ status: 'ok' })
}
