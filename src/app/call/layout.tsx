import { PropsWithChildren } from 'react'

const MeetingCallLayout = ({ children }: PropsWithChildren) => {
	return <div className='h-screen bg-black'>{children}</div>
}

export default MeetingCallLayout
