import { clientLog } from './clientLogger'
import { sdk } from './sdk'

interface AuthResponse {
	success: boolean
	token?: string
	error?: string
}

export const requestFarcasterAuth = async (): Promise<AuthResponse> => {
	try {
		// Request authentication from Farcaster client
		const authResult = await sdk.requestAuth()
		clientLog('Farcaster auth result:', authResult)

		if (!authResult.success) {
			return {
				success: false,
				error: 'Failed to authenticate with Farcaster',
			}
		}

		// Verify the authentication on our server
		const verifyResponse = await fetch('/api/auth/verify', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				message: authResult.message,
				signature: authResult.signature,
				nonce: authResult.nonce,
			}),
		})

		if (!verifyResponse.ok) {
			const error = await verifyResponse.json()
			return {
				success: false,
				error: error.message || 'Failed to verify authentication',
			}
		}

		const { token } = await verifyResponse.json()
		return {
			success: true,
			token,
		}
	} catch (error) {
		clientLog('Error during Farcaster authentication:', error)
		return {
			success: false,
			error: 'Authentication failed',
		}
	}
}

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
	return !!sdk.context.user?.fid
}

// Get current user's FID
export const getCurrentUserFid = (): number | undefined => {
	return sdk.context.user?.fid
}

// Get current user's username
export const getCurrentUsername = (): string | undefined => {
	return sdk.context.user?.username
}

// Initialize authentication
export const initAuth = async (): Promise<void> => {
	try {
		// Check if we already have a valid session
		if (isAuthenticated()) {
			clientLog('User already authenticated:', {
				fid: getCurrentUserFid(),
				username: getCurrentUsername(),
			})
			return
		}

		// Request authentication
		const authResult = await requestFarcasterAuth()
		if (!authResult.success) {
			clientLog('Authentication failed:', authResult.error)
			return
		}

		clientLog('Authentication successful:', {
			fid: getCurrentUserFid(),
			username: getCurrentUsername(),
		})
	} catch (error) {
		clientLog('Error initializing authentication:', error)
	}
}
