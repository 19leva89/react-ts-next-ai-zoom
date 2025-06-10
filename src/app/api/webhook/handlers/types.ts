import {
	CallEndedEvent,
	CallRecordingReadyEvent,
	CallSessionParticipantLeftEvent,
	CallSessionStartedEvent,
	CallTranscriptionReadyEvent,
	MessageNewEvent,
} from '@stream-io/node-sdk'

export type EventName =
	| 'call.session_started'
	| 'call.session_participant_left'
	| 'call.session_ended'
	| 'call.transcription_ready'
	| 'call.recording_ready'
	| 'message.new'

export type EventPayloadMap = {
	'call.session_started': CallSessionStartedEvent
	'call.session_participant_left': CallSessionParticipantLeftEvent
	'call.session_ended': CallEndedEvent
	'call.transcription_ready': CallTranscriptionReadyEvent
	'call.recording_ready': CallRecordingReadyEvent
	'message.new': MessageNewEvent
}

export type EventHandler<T extends EventName = EventName> = (event: EventPayloadMap[T]) => Promise<Response>

export type EventHandlerMap = {
	[K in EventName]: EventHandler<K>
}
