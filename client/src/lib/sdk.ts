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
		// Initialize SDK context from Farcaster SDK
		this.context = farcasterSdk.context
		clientLog('SDK initialized with context:', this.context)
	}

	async requestAuth() {
		try {
			const result = await farcasterSdk.actions.requestAuth()
			clientLog('Auth request result:', result)
			return result
		} catch (error) {
			clientLog('Error requesting auth:', error)
			throw error
		}
	}
}

// Create singleton instance
export const sdk = new SDK()
