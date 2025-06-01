'use client'

import { useState } from 'react'
import { StreamTheme, useCall } from '@stream-io/video-react-sdk'

import { CallEnded } from '@/modules/call/ui/components/call-ended'
import { CallLobby } from '@/modules/call/ui/components/call-lobby'
import { CallActive } from '@/modules/call/ui/components/call-active'

interface Props {
	meetingName: string
}

export const CallUI = ({ meetingName }: Props) => {
	const call = useCall()

	const [show, setShow] = useState<'lobby' | 'call' | 'ended'>('lobby')

	const handleJoin = async () => {
		if (!call) return

		try {
			await call.join()

			setShow('call')
		} catch (error) {
			console.error('Failed to join call:', error)
			// Consider showing an error message to the user
		}
	}

	const handleLeave = async () => {
		if (!call) return

		try {
			await call.endCall()

			setShow('ended')
		} catch (error) {
			console.error('Failed to end call:', error)
			// Still transition to ended state even if endCall fails
			setShow('ended')
		}
	}

	return (
		<StreamTheme className='h-full'>
			{show === 'lobby' && <CallLobby onJoin={handleJoin} />}

			{show === 'call' && <CallActive meetingName={meetingName} onLeave={handleLeave} />}

			{show === 'ended' && <CallEnded />}
		</StreamTheme>
	)
}
