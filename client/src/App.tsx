import { ThemeProvider } from '@/components/ui/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import { type FrameContext } from '@farcaster/frame-sdk'
import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
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

export default App
