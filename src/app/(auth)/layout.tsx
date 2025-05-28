import { PropsWithChildren } from 'react'

const AuthLayout = ({ children }: PropsWithChildren) => {
	return (
		<div className="flex flex-col items-center justify-center min-h-svh p-6 md:p-10 bg-muted">
			<div className="w-full max-w-sm md:max-w-3xl">{children}</div>
		</div>
	)
}

export default AuthLayout
