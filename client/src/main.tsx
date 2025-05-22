import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './index.css'
import { clientLog } from './lib/clientLogger'
import { sdk } from './lib/sdk'

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
	try {
		// Wait for SDK initialization
		await new Promise(resolve => setTimeout(resolve, 2000)) // Give SDK more time to initialize

		if (sdk.isInitialized()) {
			clientLog('info', 'SDK initialized with user:', sdk.context.user)

			// Render the app with providers and user context
			root.render(
				<QueryClientProvider client={queryClient}>
					<BrowserRouter>
						<App user={sdk.context.user} />
					</BrowserRouter>
				</QueryClientProvider>
			)
		} else {
			clientLog('info', 'Running in web environment, SDK not initialized')

			// Render the app without user context
			root.render(
				<QueryClientProvider client={queryClient}>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</QueryClientProvider>
			)
		}
	} catch (error) {
		clientLog('error', 'App initialization failed:', error)
		// Render the app anyway, but without user context
		root.render(
			<QueryClientProvider client={queryClient}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</QueryClientProvider>
		)
	}
}

// Start the app
initApp()
