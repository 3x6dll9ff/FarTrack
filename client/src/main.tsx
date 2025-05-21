import { sdk, type FrameContext } from '@farcaster/frame-sdk'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { clientLog } from './lib/clientLogger'

// Create a client
const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60, // 1 minute
			cacheTime: 1000 * 60 * 5, // 5 minutes
			retry: 1,
			refetchOnWindowFocus: false,
			refetchOnMount: true,
			refetchOnReconnect: true,
		},
	},
})

// Initialize the app
const root = createRoot(document.getElementById('root')!)

// Initialize Farcaster SDK and render App with user context
const initApp = async () => {
	let userContext: FrameContext['user'] | undefined

	try {
		// Check if we're in a Mini App environment
		const isInMiniApp = await sdk.isInMiniApp()
		clientLog('info', `Environment check: ${isInMiniApp ? 'Mini App' : 'Web'}`)

		if (isInMiniApp) {
			// Initialize SDK and get user context
			await sdk.actions.ready()
			userContext = sdk.context.user
			clientLog('info', 'SDK initialized with user:', userContext)
		}
	} catch (error) {
		clientLog('error', 'SDK initialization failed:', error)
	}

	// Render the app with providers
	root.render(
		<QueryClientProvider client={queryClient}>
			<BrowserRouter>
				<App user={userContext} />
			</BrowserRouter>
		</QueryClientProvider>
	)
}

// Start the app
initApp()
