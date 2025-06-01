import { NextResponse } from 'next/server'
import { CallSessionParticipantLeftEvent } from '@stream-io/node-sdk'

import { streamVideo } from '@/lib/stream-video'

export const handleCallSessionParticipantLeft = async (event: CallSessionParticipantLeftEvent) => {
	const meetingId = event.call_cid.split(':')[1] // call_cid is formatted as "type:id"
	if (!meetingId) return NextResponse.json({ error: 'Missing meetingId' }, { status: 400 })

	const call = streamVideo.video.call('default', meetingId)

	await call.end()

	return NextResponse.json({ status: 'ok' })
}
