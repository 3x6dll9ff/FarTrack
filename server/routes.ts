import {
	insertAchievementSchema,
	insertEngagementSchema,
	insertStatSchema,
	insertUserSchema,
} from '@shared/schema'
import type { Express, Response } from 'express'
import { createServer, type Server } from 'http'
import { ZodError } from 'zod'
import { storage } from './storage'

export async function registerRoutes(app: Express): Promise<Server> {
	// Error handler for validation errors
	const handleValidationError = (err: unknown, res: Response) => {
		if (err instanceof ZodError) {
			return res.status(400).json({ message: err.message })
		}

		console.error(err)
		return res.status(500).json({ message: 'Internal server error' })
	}

	// User routes
	app.get('/api/users', async (_req, res) => {
		try {
			const users = await storage.listUsers()
			res.json(users)
		} catch (err) {
			console.error(err)
			res.status(500).json({ message: 'Failed to retrieve users' })
		}
	})

	app.get('/api/users/top', async (req, res) => {
		try {
			const limit = req.query.limit ? parseInt(req.query.limit as string) : 5
			const users = await storage.getTopUsers(limit)
			res.json(users)
		} catch (err) {
			console.error(err)
			res.status(500).json({ message: 'Failed to retrieve top users' })
		}
	})

	app.get('/api/users/:id', async (req, res) => {
		try {
			const id = parseInt(req.params.id)
			if (isNaN(id)) {
				return res.status(400).json({ message: 'Invalid user ID' })
			}

			const user = await storage.getUser(id)
			if (!user) {
				return res.status(404).json({ message: 'User not found' })
			}

			res.json(user)
		} catch (err) {
			console.error(err)
			res.status(500).json({ message: 'Failed to retrieve user' })
		}
	})

	app.get('/api/users/username/:username', async (req, res) => {
		try {
			const username = req.params.username
			const user = await storage.getUserByUsername(username)

			if (!user) {
				return res.status(404).json({ message: 'User not found' })
			}

			res.json(user)
		} catch (err) {
			console.error(err)
			res.status(500).json({ message: 'Failed to retrieve user' })
		}
	})

	app.post('/api/users', async (req, res) => {
		try {
			const userData = insertUserSchema.parse(req.body)
			const user = await storage.createUser(userData)
			res.status(201).json(user)
		} catch (err) {
			handleValidationError(err, res)
		}
	})

	app.patch('/api/users/:id', async (req, res) => {
		try {
			const id = parseInt(req.params.id)
			if (isNaN(id)) {
				return res.status(400).json({ message: 'Invalid user ID' })
			}

			const user = await storage.updateUser(id, req.body)
			if (!user) {
				return res.status(404).json({ message: 'User not found' })
			}

			res.json(user)
		} catch (err) {
			console.error(err)
			res.status(500).json({ message: 'Failed to update user' })
		}
	})

	// Engagement routes
	app.get('/api/engagements/recent', async (req, res) => {
		try {
			const limit = req.query.limit ? parseInt(req.query.limit as string) : 20
			const engagements = await storage.getRecentEngagements(limit)
			res.json(engagements)
		} catch (err) {
			console.error(err)
			res.status(500).json({ message: 'Failed to retrieve engagements' })
		}
	})

	app.get('/api/users/:userId/engagements', async (req, res) => {
		try {
			const userId = parseInt(req.params.userId)
			if (isNaN(userId)) {
				return res.status(400).json({ message: 'Invalid user ID' })
			}

			const limit = req.query.limit ? parseInt(req.query.limit as string) : 20
			const engagements = await storage.getUserEngagements(userId, limit)
			res.json(engagements)
		} catch (err) {
			console.error(err)
			res.status(500).json({ message: 'Failed to retrieve user engagements' })
		}
	})

	app.post('/api/engagements', async (req, res) => {
		try {
			const engagementData = insertEngagementSchema.parse(req.body)
			const engagement = await storage.createEngagement(engagementData)
			res.status(201).json(engagement)
		} catch (err) {
			handleValidationError(err, res)
		}
	})

	// Achievement routes
	app.get('/api/users/:userId/achievements', async (req, res) => {
		try {
			const userId = parseInt(req.params.userId)
			if (isNaN(userId)) {
				return res.status(400).json({ message: 'Invalid user ID' })
			}

			const achievements = await storage.getUserAchievements(userId)
			res.json(achievements)
		} catch (err) {
			console.error(err)
			res.status(500).json({ message: 'Failed to retrieve user achievements' })
		}
	})

	app.post('/api/achievements', async (req, res) => {
		try {
			const achievementData = insertAchievementSchema.parse(req.body)
			const achievement = await storage.createAchievement(achievementData)
			res.status(201).json(achievement)
		} catch (err) {
			handleValidationError(err, res)
		}
	})

	// Stats routes
	app.get('/api/users/:userId/stats', async (req, res) => {
		try {
			const userId = parseInt(req.params.userId)
			if (isNaN(userId)) {
				return res.status(400).json({ message: 'Invalid user ID' })
			}

			const period = req.query.period as string | undefined
			const stats = await storage.getUserStats(userId, period)
			res.json(stats)
		} catch (err) {
			console.error(err)
			res.status(500).json({ message: 'Failed to retrieve user stats' })
		}
	})

	app.post('/api/stats', async (req, res) => {
		try {
			const statData = insertStatSchema.parse(req.body)
			const stat = await storage.createStat(statData)
			res.status(201).json(stat)
		} catch (err) {
			handleValidationError(err, res)
		}
	})

	const httpServer = createServer(app)
	return httpServer
}
