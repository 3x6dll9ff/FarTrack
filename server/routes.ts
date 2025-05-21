import type { Express, Response } from 'express'
import { createServer, type Server } from 'http'
import { ZodError } from 'zod'
import {
	insertAchievementSchema,
	insertEngagementSchema,
	insertStatSchema,
	insertUserSchema,
} from '../shared/schema.js'
import { storage } from './storage.js'

// API Configuration
const WARPCAST_API_URL = 'https://api.warpcast.com/v2'

// Error handler for validation errors
const handleValidationError = (err: unknown, res: Response) => {
	if (err instanceof ZodError) {
		return res.status(400).json({ message: err.message })
	}
	console.error(err)
	return res.status(500).json({ message: 'Internal server error' })
}

// Helper function to parse and validate user ID
const parseUserId = (id: string): number | null => {
	const parsedId = parseInt(id)
	return isNaN(parsedId) ? null : parsedId
}

export async function registerRoutes(app: Express): Promise<Server> {
	// User routes
	app.get('/api/users', async (_req, res) => {
		try {
			res.json(await storage.listUsers())
		} catch (err) {
			handleValidationError(err, res)
		}
	})

	app.get('/api/users/top', async (req, res) => {
		try {
			const limit = parseInt(req.query.limit as string) || 5
			res.json(await storage.getTopUsers(limit))
		} catch (err) {
			handleValidationError(err, res)
		}
	})

	app.get('/api/users/:id', async (req, res) => {
		try {
			const id = parseUserId(req.params.id)
			if (!id) return res.status(400).json({ message: 'Invalid user ID' })

			const user = await storage.getUser(id)
			if (!user) return res.status(404).json({ message: 'User not found' })

			res.json(user)
		} catch (err) {
			handleValidationError(err, res)
		}
	})

	app.get('/api/users/username/:username', async (req, res) => {
		try {
			const user = await storage.getUserByUsername(req.params.username)
			if (!user) return res.status(404).json({ message: 'User not found' })
			res.json(user)
		} catch (err) {
			handleValidationError(err, res)
		}
	})

	app.post('/api/users', async (req, res) => {
		try {
			const userData = insertUserSchema.parse(req.body)
			res.status(201).json(await storage.createUser(userData))
		} catch (err) {
			handleValidationError(err, res)
		}
	})

	app.patch('/api/users/:id', async (req, res) => {
		try {
			const id = parseUserId(req.params.id)
			if (!id) return res.status(400).json({ message: 'Invalid user ID' })

			const user = await storage.updateUser(id, req.body)
			if (!user) return res.status(404).json({ message: 'User not found' })

			res.json(user)
		} catch (err) {
			handleValidationError(err, res)
		}
	})

	// Engagement routes
	app.get('/api/engagements/recent', async (req, res) => {
		try {
			const limit = parseInt(req.query.limit as string) || 20
			res.json(await storage.getRecentEngagements(limit))
		} catch (err) {
			handleValidationError(err, res)
		}
	})

	app.get('/api/users/:userId/engagements', async (req, res) => {
		try {
			const userId = parseUserId(req.params.userId)
			if (!userId) return res.status(400).json({ message: 'Invalid user ID' })

			const limit = parseInt(req.query.limit as string) || 20
			res.json(await storage.getUserEngagements(userId, limit))
		} catch (err) {
			handleValidationError(err, res)
		}
	})

	app.post('/api/engagements', async (req, res) => {
		try {
			const engagementData = insertEngagementSchema.parse(req.body)
			res.status(201).json(await storage.createEngagement(engagementData))
		} catch (err) {
			handleValidationError(err, res)
		}
	})

	// Achievement routes
	app.get('/api/users/:userId/achievements', async (req, res) => {
		try {
			const userId = parseUserId(req.params.userId)
			if (!userId) return res.status(400).json({ message: 'Invalid user ID' })

			res.json(await storage.getUserAchievements(userId))
		} catch (err) {
			handleValidationError(err, res)
		}
	})

	app.post('/api/achievements', async (req, res) => {
		try {
			const achievementData = insertAchievementSchema.parse(req.body)
			res.status(201).json(await storage.createAchievement(achievementData))
		} catch (err) {
			handleValidationError(err, res)
		}
	})

	// Stats routes
	app.get('/api/users/:userId/stats', async (req, res) => {
		try {
			const userId = parseUserId(req.params.userId)
			if (!userId) return res.status(400).json({ message: 'Invalid user ID' })

			const period = req.query.period as string | undefined
			res.json(await storage.getUserStats(userId, period))
		} catch (err) {
			handleValidationError(err, res)
		}
	})

	app.post('/api/stats', async (req, res) => {
		try {
			const statData = insertStatSchema.parse(req.body)
			res.status(201).json(await storage.createStat(statData))
		} catch (err) {
			handleValidationError(err, res)
		}
	})

	// Add new log endpoint
	app.post('/api/log', (req, res) => {
		const { level, message, ...metadata } = req.body
		// Log the message on the server side with full context
		const logMessage = `[CLIENT LOG] [${level || 'info'}] ${message}`

		// Log the full context if it's a SDK context message
		if (message === 'Full SDK Context:') {
			console.log(logMessage)
			console.log('SDK Context Data:', JSON.stringify(metadata, null, 2))
		} else if (Object.keys(metadata).length > 0) {
			console.log(logMessage, JSON.stringify(metadata, null, 2))
		} else {
			console.log(logMessage)
		}

		res.sendStatus(200)
	})

	// Warpcast API proxy
	app.get('/api/warpcast/user/:username', async (req, res) => {
		const { username } = req.params
		console.log('[WARPCAST] Fetching user profile for username:', username)

		try {
			const response = await fetch(`${WARPCAST_API_URL}/user/${username}`)
			console.log('[WARPCAST] Response status:', response.status)

			if (!response.ok) {
				console.error(
					'[WARPCAST] Error response:',
					response.status,
					response.statusText
				)
				throw new Error(`HTTP error! status: ${response.status}`)
			}

			const data = await response.json()
			console.log('[WARPCAST] Response data:', data)
			res.json(data)
		} catch (error) {
			console.error('[WARPCAST] Error:', error)
			res.status(500).json({ error: 'Failed to fetch user profile' })
		}
	})

	// Add new endpoint to get user by FID
	app.get('/api/users/fid/:fid', async (req, res) => {
		try {
			const fid = parseInt(req.params.fid)
			if (isNaN(fid)) {
				return res.status(400).json({ message: 'Invalid FID' })
			}

			console.log(`[API] Getting user by FID: ${fid}`)
			const user = await storage.getUserByFid(fid)
			if (!user) {
				console.log(`[API] User not found for FID: ${fid}`)
				return res.status(404).json({ message: 'User not found' })
			}

			console.log(`[API] Found user:`, user)
			res.json(user)
		} catch (err) {
			console.error('[API] Error getting user by FID:', err)
			handleValidationError(err, res)
		}
	})

	// Update sync endpoint to use FID
	app.post('/api/users/sync', async (req, res) => {
		try {
			const { fid } = req.body
			if (!fid) {
				return res.status(400).json({ message: 'FID is required' })
			}

			console.log(`[SYNC] Syncing user data for FID: ${fid}`)

			// Fetch user data from Warpcast
			const warpcastResponse = await fetch(
				`https://api.warpcast.com/v2/user/${fid}`
			)
			if (!warpcastResponse.ok) {
				throw new Error(
					`Failed to fetch user from Warpcast: ${warpcastResponse.status}`
				)
			}

			const warpcastData = await warpcastResponse.json()
			console.log(
				`[SYNC] Warpcast data:`,
				JSON.stringify(warpcastData, null, 2)
			)

			if (!warpcastData.result?.user) {
				throw new Error('No user data in Warpcast response')
			}

			const warpcastUser = warpcastData.result.user

			// Create or update user in our storage
			const userData = {
				fid: parseInt(fid),
				username: warpcastUser.username,
				displayName: warpcastUser.displayName,
				bio: warpcastUser.bio,
				profileImage: warpcastUser.pfp,
				followerCount: warpcastUser.followerCount,
				followingCount: warpcastUser.followingCount,
			}

			let user
			const existingUser = await storage.getUserByFid(parseInt(fid))
			if (existingUser) {
				console.log(`[SYNC] Updating existing user with FID: ${fid}`)
				user = await storage.updateUser(existingUser.id, userData)
			} else {
				console.log(`[SYNC] Creating new user with FID: ${fid}`)
				user = await storage.createUser(userData)
			}

			if (!user) {
				throw new Error('Failed to create/update user')
			}

			console.log(`[SYNC] User synced successfully:`, user)
			res.json(user)
		} catch (error) {
			console.error('[SYNC] Error:', error)
			res.status(500).json({ error: 'Failed to sync user data' })
		}
	})

	// Add new endpoints for fetching data by FID
	app.get('/api/users/fid/:fid/achievements', async (req, res) => {
		try {
			const fid = parseInt(req.params.fid)
			if (isNaN(fid)) {
				return res.status(400).json({ message: 'Invalid FID' })
			}

			console.log(`[API] Getting achievements for FID: ${fid}`)
			const user = await storage.getUserByFid(fid)
			if (!user) {
				console.log(`[API] User not found for FID: ${fid}`)
				return res.status(404).json({ message: 'User not found' })
			}

			const achievements = await storage.getUserAchievements(user.id)
			console.log(`[API] Found achievements:`, achievements)
			res.json(achievements)
		} catch (err) {
			console.error('[API] Error getting achievements:', err)
			handleValidationError(err, res)
		}
	})

	app.get('/api/users/fid/:fid/stats', async (req, res) => {
		try {
			const fid = parseInt(req.params.fid)
			if (isNaN(fid)) {
				return res.status(400).json({ message: 'Invalid FID' })
			}

			console.log(`[API] Getting stats for FID: ${fid}`)
			const user = await storage.getUserByFid(fid)
			if (!user) {
				console.log(`[API] User not found for FID: ${fid}`)
				return res.status(404).json({ message: 'User not found' })
			}

			const period = req.query.period as string | undefined
			const stats = await storage.getUserStats(user.id, period)
			console.log(`[API] Found stats:`, stats)
			res.json(stats)
		} catch (err) {
			console.error('[API] Error getting stats:', err)
			handleValidationError(err, res)
		}
	})

	// Auth verification endpoint
	app.post('/api/auth/verify', async (req, res) => {
		try {
			const { message, signature, nonce } = req.body

			if (!message || !signature || !nonce) {
				return res.status(400).json({
					success: false,
					message: 'Missing required authentication data',
				})
			}

			// Verify the signature using Farcaster's verification
			const verificationResult = await verifySignInMessage(
				message,
				signature,
				nonce
			)

			if (!verificationResult.success) {
				return res.status(401).json({
					success: false,
					message: 'Invalid signature',
				})
			}

			// Get user data from Warpcast API
			const warpcastUser = await fetchWarpcastUser(verificationResult.fid)

			if (!warpcastUser) {
				return res.status(404).json({
					success: false,
					message: 'User not found on Warpcast',
				})
			}

			// Create or update user in our storage
			const user = await storage.createOrUpdateUser({
				fid: verificationResult.fid,
				username: warpcastUser.username,
				display_name: warpcastUser.displayName,
				pfp_url: warpcastUser.pfp,
				bio: warpcastUser.bio,
				active_on_farcaster: true,
				registered_at: new Date().toISOString(),
			})

			// Generate session token
			const token = generateSessionToken(user)

			res.json({
				success: true,
				token,
				user,
			})
		} catch (error) {
			console.error('Error verifying authentication:', error)
			res.status(500).json({
				success: false,
				message: 'Internal server error',
			})
		}
	})

	// Helper function to verify Farcaster sign-in message
	async function verifySignInMessage(
		message: string,
		signature: string,
		nonce: string
	) {
		try {
			// TODO: Implement actual Farcaster signature verification
			// This is a placeholder that should be replaced with actual verification logic
			return {
				success: true,
				fid: 1, // This should be extracted from the verified message
			}
		} catch (error) {
			console.error('Error verifying signature:', error)
			return {
				success: false,
				error: 'Signature verification failed',
			}
		}
	}

	// Helper function to generate session token
	function generateSessionToken(user: any) {
		// TODO: Implement proper JWT token generation
		// This is a placeholder that should be replaced with actual JWT generation
		return `session_${user.fid}_${Date.now()}`
	}

	return createServer(app)
}
