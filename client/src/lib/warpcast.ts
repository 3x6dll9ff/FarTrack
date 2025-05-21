// Warpcast API integration

// API Configuration
const WARPCAST_API_URL = 'https://api.warpcast.com/v2'

// Types for Warpcast API
export interface AccountLocation {
	placeId: string
	description: string
}

export interface WarpcastUserProfile {
	fid: number
	username?: string
	displayName?: string
	pfp?: string
	bio?: string
	location?: AccountLocation
}

export interface WarpcastCast {
	hash: string
	threadHash: string
	text: string
	timestamp: string
	reactions: {
		count: number
	}
	recasts: {
		count: number
	}
	replies: {
		count: number
	}
	author: {
		fid: number
		username: string
		displayName: string
		pfp: {
			url: string
		}
	}
}

export class WarpcastClient {
	private apiKey: string

	constructor(apiKey: string) {
		this.apiKey = apiKey
	}

	async getUserProfile(fid: string) {
		const response = await fetch(`${WARPCAST_API_URL}/user/${fid}`, {
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
			},
		})
		return response.json()
	}

	async getCasts(fid: string, limit = 10) {
		const response = await fetch(
			`${WARPCAST_API_URL}/casts?fid=${fid}&limit=${limit}`,
			{
				headers: {
					Authorization: `Bearer ${this.apiKey}`,
				},
			}
		)
		return response.json()
	}

	async getEngagement(fid: string) {
		const response = await fetch(`${WARPCAST_API_URL}/user/${fid}/engagement`, {
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
			},
		})
		return response.json()
	}

	async shareAchievement(name: string, description: string) {
		const response = await fetch(`${WARPCAST_API_URL}/cast`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${this.apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				text: `🎉 ${name}\n${description}\n\nTrack your achievements with FarTrack!`,
			}),
		})
		return response.json()
	}
}

// Create a singleton instance
export const warpcastClient = new WarpcastClient(
	import.meta.env.VITE_WARPCAST_API_KEY || ''
)

// Function to get user profile from Warpcast
export const getWarpcastUserProfile = async (
	fid: number
): Promise<WarpcastUserProfile | null> => {
	try {
		console.log('Fetching Warpcast user profile for FID:', fid)
		const url = `/api/warpcast/user/${fid}`
		console.log('API URL:', url)

		const response = await fetch(url)
		console.log('API Response status:', response.status)

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		const data = await response.json()
		console.log('API Response data:', data)

		if (!data.result?.user) {
			console.error('No user data in response:', data)
			return null
		}

		return data.result.user
	} catch (error) {
		console.error('Error fetching Warpcast user profile:', error)
		return null
	}
}

// Function to sync user data with our app
export const syncUserData = async (
	username: string,
	userId?: number
): Promise<boolean> => {
	try {
		const response = await fetch(`/api/users/sync`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ username, userId }),
		})

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`)
		}

		return true
	} catch (error) {
		console.error('Error syncing user data:', error)
		return false
	}
}
