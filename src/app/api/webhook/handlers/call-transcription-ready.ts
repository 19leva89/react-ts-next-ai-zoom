import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { CallTranscriptionReadyEvent } from '@stream-io/node-sdk'

import { db } from '@/db'
import { inngest } from '@/inngest/client'
import { meetings } from '@/db/schema/meetings'

export const handleCallTranscriptionReady = async (event: CallTranscriptionReadyEvent) => {
	const meetingId = event.call_cid.split(':')[1] // call_cid is formatted as "type:id"
	if (!meetingId) return NextResponse.json({ error: 'Missing meetingId' }, { status: 400 })

	const [updatedMeeting] = await db
		.update(meetings)
		.set({
			transcriptUrl: event.call_transcription.url,
		})
		.where(eq(meetings.id, meetingId))
		.returning()

	if (!updatedMeeting) {
		return NextResponse.json({ error: 'Meeting not found' }, { status: 404 })
	}

	await inngest.send({
		name: 'meetings/processing',
		data: {
			meetingId: updatedMeeting.id,
			transcriptUrl: updatedMeeting.transcriptUrl,
		},
	})

	return NextResponse.json({ status: 'ok' })
}
