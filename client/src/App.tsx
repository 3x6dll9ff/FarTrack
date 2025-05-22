import { ThemeProvider } from '@/components/ui/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { sdk, type FrameContext } from '@farcaster/frame-sdk'
import { farcasterFrame as frameConnector } from '@farcaster/frame-wagmi-connector'
import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { useAccount, useConnect, useSignMessage } from 'wagmi'
import { AppLayout } from './components/layout/app-layout'
import { Skeleton } from './components/ui/skeleton'

// Lazy load pages
const Dashboard = lazy(() => import('@/pages/dashboard'))
const Achievements = lazy(() => import('@/pages/achievements'))
const Profile = lazy(() => import('@/pages/profile'))
const NotFound = lazy(() => import('@/pages/not-found'))

// Loading component
const PageLoader = () => (
	<div className='p-4 space-y-4'>
		<Skeleton className='h-8 w-3/4' />
		<Skeleton className='h-32 w-full' />
		<Skeleton className='h-32 w-full' />
	</div>
)

interface AppProps {
	user?: FrameContext['user']
}

function App({ user }: AppProps) {
	useEffect(() => {
		sdk.actions.ready()
	}, [])

	return (
		<ThemeProvider defaultTheme='dark'>
			<TooltipProvider>
				<Toaster />
				<AppLayout user={user}>
					<Suspense fallback={<PageLoader />}>
						<Routes>
							<Route path='/' element={<Dashboard />} />
							<Route path='/profile/:id' element={<Profile />} />
							<Route path='/achievements' element={<Achievements />} />
							<Route path='*' element={<NotFound />} />
						</Routes>
					</Suspense>
				</AppLayout>
			</TooltipProvider>
		</ThemeProvider>
	)
}

function ConnectMenu() {
	const { isConnected, address } = useAccount()
	const { connect } = useConnect()

	if (isConnected) {
		return (
			<div>
				<div>Connected account: {address}</div>
				<SignButton />
			</div>
		)
	}

	return (
		<button
			type='button'
			onClick={() => connect({ connector: frameConnector() })}
		>
			Connect
		</button>
	)
}

function SignButton() {
	const { signMessage, isPending, data, error } = useSignMessage()

	return (
		<div>
			<button
				type='button'
				onClick={() => signMessage({ message: 'hello world' })}
				disabled={isPending}
			>
				{isPending ? 'Signing...' : 'Sign message'}
			</button>
			{data && (
				<div>
					<div>Signature</div>
					<div>{data}</div>
				</div>
			)}
			{error && (
				<div>
					<div>Error</div>
					<div>{error.message}</div>
				</div>
			)}
		</div>
	)
}

export default App
