import { NextRequest, NextResponse } from 'next/server'

import { streamVideo } from '@/lib/stream-video'
import { eventHandlers } from '@/app/api/webhook/handlers/index'
import { EventPayloadMap, EventName } from '@/app/api/webhook/handlers/types'

function handleEvent<T extends EventName>(event: T, payload: unknown): Promise<Response> {
	const handler = eventHandlers[event]
	return handler(payload as EventPayloadMap[T])
}

function verifySignatureWithSDK(body: string, signature: string): boolean {
	return streamVideo.verifyWebhook(body, signature)
}

export async function POST(req: NextRequest) {
	const apiKey = req.headers.get('x-api-key')
	const signature = req.headers.get('x-signature')

	if (!signature || apiKey !== process.env.STREAM_VIDEO_API_KEY) {
		return NextResponse.json({ error: 'Missing signature or API key' }, { status: 400 })
	}

	const body = await req.text()

	if (!verifySignatureWithSDK(body, signature)) {
		return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
	}

	let rawPayload: unknown

	try {
		rawPayload = JSON.parse(body)
	} catch {
		return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
	}

	const eventType = (rawPayload as { type?: string })?.type

	if (!eventType || !(eventType in eventHandlers)) {
		return NextResponse.json({ error: `Unhandled or missing event type: ${eventType}` }, { status: 400 })
	}

	return handleEvent(eventType as EventName, rawPayload)
}
