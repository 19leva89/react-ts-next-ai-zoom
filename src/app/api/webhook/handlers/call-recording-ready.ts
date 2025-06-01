import { eq } from 'drizzle-orm'
import { NextResponse } from 'next/server'
import { CallRecordingReadyEvent } from '@stream-io/node-sdk'

import { db } from '@/db'
import { meetings } from '@/db/schema/meetings'

export const handleCallRecordingReady = async (event: CallRecordingReadyEvent) => {
	const meetingId = event.call_cid.split(':')[1] // call_cid is formatted as "type:id"
	if (!meetingId) return NextResponse.json({ error: 'Missing meetingId' }, { status: 400 })

	await db.update(meetings).set({ recordingUrl: event.call_recording.url }).where(eq(meetings.id, meetingId))

	return NextResponse.json({ status: 'ok' })
}
