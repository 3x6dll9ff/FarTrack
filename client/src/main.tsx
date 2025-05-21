import { sdk } from '@farcaster/frame-sdk'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Initialize the app
const root = createRoot(document.getElementById('root')!)
root.render(<App />)

// Initialize Farcaster SDK and hide splash screen when app is ready
const initFarcaster = async () => {
	try {
		await sdk.actions.ready()
		console.log('Farcaster SDK initialized')
	} catch (error) {
		console.error('Failed to initialize Farcaster SDK:', error)
	}
}

// Check if we're in a Farcaster Mini App
const url = new URL(window.location.href)
const checkIfMiniAppAndInit = async () => {
	const isMiniApp = await sdk.isInMiniApp()
	console.log(`Checked if Mini App environment: ${isMiniApp}`)

	if (isMiniApp) {
		initFarcaster()
	} else {
		console.log(
			'Not in Mini App environment according to sdk.isInMiniApp(), skipping SDK init'
		)
	}
}

checkIfMiniAppAndInit()
