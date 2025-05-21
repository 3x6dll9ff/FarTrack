import { sdk, type FrameContext } from '@farcaster/frame-sdk'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'
import { clientLog } from './lib/clientLogger'

// Initialize the app
const root = createRoot(document.getElementById('root')!)

// Initialize Farcaster SDK and hide splash screen when app is ready
const initFarcaster = async () => {
	try {
		await sdk.actions.ready()
		clientLog('info', 'Farcaster SDK initialized')
	} catch (error) {
		clientLog('error', 'Failed to initialize Farcaster SDK:', {
			error: error.message,
		})
	}
}

// Check if we're in a Farcaster Mini App
const url = new URL(window.location.href)
const checkIfMiniAppAndInit = async () => {
	const isMiniApp = await sdk.isInMiniApp()
	clientLog('info', `Checked if Mini App environment: ${isMiniApp}`)

	if (isMiniApp) {
		initFarcaster()
	} else {
		clientLog(
			'info',
			'Not in Mini App environment according to sdk.isInMiniApp(), skipping SDK init'
		)
	}
}

checkIfMiniAppAndInit()

// Function to render the App, potentially with user context
const renderApp = (userContext?: FrameContext['user']) => {
	root.render(<App user={userContext} />)
}

// Initialize Farcaster SDK, hide splash screen, and render App with user context
const initFarcasterAndRenderApp = async () => {
	let userContext: FrameContext['user'] | undefined
	try {
		const isInMiniApp = await sdk.isInMiniApp()
		clientLog(
			'info',
			`Checked if Mini App environment during main render: ${isInMiniApp}`
		)

		if (isInMiniApp) {
			// Wait for SDK ready and get user context
			await sdk.actions.ready()
			userContext = sdk.context.user // Get user context
			clientLog(
				'info',
				'Farcaster SDK initialized and ready called. User:',
				userContext
			) // Log user context
		} else {
			clientLog(
				'info',
				'Not in Mini App environment according to sdk.isInMiniApp(), rendering without SDK init'
			)
		}
	} catch (error) {
		clientLog(
			'error',
			'Failed during Farcaster SDK init or context retrieval:',
			{ error: error.message }
		)
	} finally {
		// Always render the app, even if SDK init fails or not in Mini App
		renderApp(userContext)
	}
}

initFarcasterAndRenderApp() // Start the process
