'use client'

import Link from 'next/link'
import { z } from 'zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { OctagonAlertIcon } from 'lucide-react'
import { FaGithub, FaGoogle } from 'react-icons/fa'
import { zodResolver } from '@hookform/resolvers/zod'

import {
	Alert,
	AlertTitle,
	Button,
	Card,
	CardContent,
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Input,
} from '@/components/ui'
import { authClient } from '@/lib/auth-client'

const formSchema = z.object({
	email: z.string().email(),
	password: z
		.string()
		.min(8, { message: 'Password must be at least 8 characters' })
		.regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
			message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
		}),
})

export const SignInView = () => {
	const router = useRouter()

	const [error, setError] = useState<string | null>(null)
	const [pending, setPending] = useState<boolean>(false)

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: '',
			password: '',
		},
	})

	const onSubmit = (data: z.infer<typeof formSchema>) => {
		setError(null)
		setPending(true)

		authClient.signIn.email(
			{
				email: data.email,
				password: data.password,
				callbackURL: '/',
			},
			{
				onSuccess: () => {
					setPending(false)
					router.push('/')
				},
				onError: ({ error }) => {
					setPending(false)
					setError(error.message)
				},
			},
		)
	}

	const onSocial = (provider: 'github' | 'google') => {
		setError(null)
		setPending(true)

		authClient.signIn.social(
			{
				provider: provider,
				callbackURL: '/',
			},
			{
				onSuccess: () => {
					setPending(false)
				},
				onError: ({ error }) => {
					setPending(false)
					setError(error.message)
				},
			},
		)
	}

	return (
		<div className='flex flex-col gap-6'>
			<Card className='overflow-hidden p-0'>
				<CardContent className='grid p-0 md:grid-cols-2'>
					<Form {...form}>
						<form onSubmit={form.handleSubmit(onSubmit)} className='p-6 md:p-8'>
							<div className='flex flex-col gap-6'>
								<div className='flex flex-col items-center text-center'>
									<h1 className='text-2xl font-bold'>Welcome back</h1>

									<p className='text-balance text-muted-foreground'>Login to your account</p>
								</div>

								<div className='grid gap-3'>
									<FormField
										name='email'
										control={form.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Email</FormLabel>

												<FormControl>
													<Input type='email' placeholder='johndoe@example.com' {...field} />
												</FormControl>

												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className='grid gap-3'>
									<FormField
										name='password'
										control={form.control}
										render={({ field }) => (
											<FormItem>
												<FormLabel>Password</FormLabel>

												<FormControl>
													<Input type='password' placeholder='********' {...field} />
												</FormControl>

												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								{!!error && (
									<Alert className='border-none bg-destructive/10'>
										<OctagonAlertIcon className='size-4 !text-destructive' />

										<AlertTitle>{error}</AlertTitle>
									</Alert>
								)}

								<Button type='submit' disabled={pending} className='w-full'>
									Sign in
								</Button>

								<div className='relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border'>
									<span className='relative z-10 bg-card px-2 text-muted-foreground'>Or continue with</span>
								</div>

								<div className='grid grid-cols-2 gap-4'>
									<Button
										variant='outline'
										type='button'
										disabled={pending}
										onClick={() => onSocial('google')}
										className='w-full'
									>
										<FaGoogle />
									</Button>

									<Button
										variant='outline'
										type='button'
										disabled={pending}
										onClick={() => onSocial('github')}
										className='w-full'
									>
										<FaGithub />
									</Button>
								</div>

								<div className='text-center text-sm'>
									Don&apos;t have an account?
									<Link href='/sign-up' className='underline underline-offset-4'>
										{' '}
										Sign up
									</Link>
								</div>
							</div>
						</form>
					</Form>

					<div className='relative hidden flex-col items-center justify-center gap-y-4 bg-radial from-sidebar-accent to-sidebar md:flex'>
						<img src='/svg/logo.svg' alt='Logo' className='size-23' />

						<p className='text-2xl font-semibold text-white'>Zoom.AI</p>
					</div>
				</CardContent>
			</Card>

			<div className='text-center text-xs text-balance text-muted-foreground *:[a]:underline *:[a]:underline-offset-4 *:[a]:hover:text-primary'>
				By clicking continue, you agree to our <a href='#'>Terms of Service</a> and{' '}
				<a href='#'>Privacy Policy</a>
			</div>
		</div>
	)
}
