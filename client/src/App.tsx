import { ThemeProvider } from '@/components/ui/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { TooltipProvider } from '@/components/ui/tooltip'
import Achievements from '@/pages/achievements'
import Analytics from '@/pages/analytics'
import Dashboard from '@/pages/dashboard'
import NotFound from '@/pages/not-found'
import Profile from '@/pages/profile'
import { type FrameContext } from '@farcaster/frame-sdk'
import { QueryClientProvider } from '@tanstack/react-query'
import { Routes, Route } from 'react-router-dom'
import { queryClient } from './lib/queryClient'

interface RouterProps {
	user?: FrameContext['user']
}

function App({ user }: RouterProps) {
	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider defaultTheme='light'>
				<TooltipProvider>
					<Toaster />
					<Routes>
						<Route path='/' element={<Dashboard user={user} />} />
						<Route path='/profile/:id' element={<Profile />} />
						<Route path='/analytics' element={<Analytics />} />
						<Route path='/achievements' element={<Achievements />} />
						<Route path='*' element={<NotFound />} />
					</Routes>
				</TooltipProvider>
			</ThemeProvider>
		</QueryClientProvider>
	)
}

export default App
