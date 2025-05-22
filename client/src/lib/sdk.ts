import { sdk as farcasterSdk, type FrameContext } from '@farcaster/frame-sdk'
import { clientLog } from './clientLogger'

// Re-export types
export type { FrameContext }

// SDK Types
export type FrameContext = {
	user: {
		fid: number
		username?: string
		displayName?: string
		pfpUrl?: string
		bio?: string
		location?: AccountLocation
	}
	location?: FrameLocationContext
	client: {
		clientFid: number
		added: boolean
		safeAreaInsets?: SafeAreaInsets
		notificationDetails?: FrameNotificationDetails
	}
}

export type AccountLocation = {
	placeId: string
	description: string
}

export type CastEmbedLocationContext = {
	type: 'cast_embed'
	embed: string
	cast: {
		fid: number
		hash: string
	}
}

export type NotificationLocationContext = {
	type: 'notification'
	notification: {
		notificationId: string
		title: string
		body: string
	}
}

export type LauncherLocationContext = {
	type: 'launcher'
}

export type ChannelLocationContext = {
	type: 'channel'
	channel: {
		key: string
		name: string
		imageUrl?: string
	}
}

export type FrameLocationContext =
	| CastEmbedLocationContext
	| NotificationLocationContext
	| LauncherLocationContext
	| ChannelLocationContext

export type SafeAreaInsets = {
	top: number
	bottom: number
	left: number
	right: number
}

export type FrameNotificationDetails = {
	url: string
	token: string
}

// SDK initialization
class SDK {
	private initialized = false
	context: FrameContext = {
		user: {
			fid: 0,
		},
		client: {
			clientFid: 0,
			added: false,
		},
	}

	constructor() {
		this.initialize()
	}

	private async initialize() {
		try {
			// Check if we're in a Mini App environment
			const isInMiniApp = await farcasterSdk.isInMiniApp()
			clientLog(
				'info',
				`Environment check: ${isInMiniApp ? 'Mini App' : 'Web'}`
			)

			if (isInMiniApp) {
				// Initialize SDK
				await farcasterSdk.actions.ready()

				// Get user context
				const userContext = await farcasterSdk.getUserContext()
				if (userContext) {
					this.context = {
						...this.context,
						user: {
							fid: userContext.fid,
							username: userContext.username,
							displayName: userContext.displayName,
							pfpUrl: userContext.pfpUrl,
							bio: userContext.bio,
						},
					}
				}

				// Get client context
				const clientContext = await farcasterSdk.getClientContext()
				if (clientContext) {
					this.context = {
						...this.context,
						client: {
							clientFid: clientContext.fid,
							added: clientContext.added,
							safeAreaInsets: clientContext.safeAreaInsets,
							notificationDetails: clientContext.notificationDetails,
						},
					}
				}

				this.initialized = true
				clientLog('info', 'SDK initialized with context:', this.context)
			} else {
				clientLog('info', 'Running in web environment, SDK not initialized')
			}
		} catch (error) {
			clientLog('error', 'SDK initialization failed:', error)
			throw error
		}
	}

	async requestAuth() {
		if (!this.initialized) {
			throw new Error('SDK not initialized')
		}

		try {
			const result = await farcasterSdk.actions.requestAuth()
			clientLog('info', 'Auth request result:', result)
			return result
		} catch (error) {
			clientLog('error', 'Error requesting auth:', error)
			throw error
		}
	}

	isInitialized() {
		return this.initialized
	}
}

// Create singleton instance
export const sdk = new SDK()
