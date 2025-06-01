import { EventHandlerMap } from '@/app/api/webhook/handlers/types'
import { handleCallSessionEnded } from '@/app/api/webhook/handlers/call-session-ended'
import { handleCallSessionStarted } from '@/app/api/webhook/handlers/call-session-started'
import { handleCallRecordingReady } from '@/app/api/webhook/handlers/call-recording-ready'
import { handleCallTranscriptionReady } from '@/app/api/webhook/handlers/call-transcription-ready'
import { handleCallSessionParticipantLeft } from '@/app/api/webhook/handlers/call-session-participant-left'

export const eventHandlers: EventHandlerMap = {
	'call.session_started': handleCallSessionStarted,
	'call.session_participant_left': handleCallSessionParticipantLeft,
	'call.session_ended': handleCallSessionEnded,
	'call.transcription_ready': handleCallTranscriptionReady,
	'call.recording_ready': handleCallRecordingReady,
}
