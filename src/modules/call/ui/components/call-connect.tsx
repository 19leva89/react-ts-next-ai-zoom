'use client'

import { LoaderIcon } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { Call, CallingState, StreamCall, StreamVideo, StreamVideoClient } from '@stream-io/video-react-sdk'

import { useTRPC } from '@/trpc/client'
import { CallUI } from '@/modules/call/ui/components/call-ui'

import '@stream-io/video-react-sdk/dist/css/styles.css'

interface Props {
	meetingId: string
	meetingName: string
	userId: string
	userName: string
	userImage: string
}

export const CallConnect = ({ meetingId, meetingName, userId, userName, userImage }: Props) => {
	const trpc = useTRPC()

	const { mutateAsync: generateToken } = useMutation(trpc.meetings.generateToken.mutationOptions())

	const [call, setCall] = useState<Call>()
	const [client, setClient] = useState<StreamVideoClient>()

	useEffect(() => {
		let _client: StreamVideoClient | undefined

		const apiKey = process.env.STREAM_VIDEO_API_KEY
		if (!apiKey) {
			throw new Error('STREAM_VIDEO_API_KEY is not configured')
		}

		const initializeClient = async () => {
			try {
				_client = new StreamVideoClient({
					apiKey,
					user: {
						id: userId,
						name: userName,
						image: userImage,
					},
					tokenProvider: generateToken,
				})

				setClient(_client)
			} catch (error) {
				console.error('Failed to initialize Stream Video client:', error)
				// Consider showing an error state to the user
			}
		}

		initializeClient()

		return () => {
			if (_client) {
				_client.disconnectUser()
			}
			setClient(undefined)
		}
	}, [userId, userName, userImage, generateToken])

	useEffect(() => {
		if (!client) return

		const _call = client.call('default', meetingId)
		_call.camera.disable()
		_call.microphone.disable()
		setCall(_call)

		return () => {
			if (_call.state.callingState !== CallingState.LEFT) {
				_call.leave()
				_call.endCall()
				setCall(undefined)
			}
		}
	}, [client, meetingId])

	if (!client || !call) {
		return (
			<div className='flex h-screen items-center justify-center bg-radial from-sidebar-accent to-sidebar'>
				<LoaderIcon className='size-6 animate-spin text-white' />
			</div>
		)
	}

	return (
		<StreamVideo client={client}>
			<StreamCall call={call}>
				<CallUI meetingName={meetingName} />
			</StreamCall>
		</StreamVideo>
	)
}
