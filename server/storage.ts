import {
	Achievement,
	Engagement,
	InsertAchievement,
	InsertEngagement,
	InsertStat,
	InsertUser,
	Stat,
	User,
} from '../shared/schema.js'

export interface IStorage {
	// User methods
	getUser(id: number): Promise<User | undefined>
	getUserByFid(fid: number): Promise<User | undefined>
	getUserByUsername(username: string): Promise<User | undefined>
	createUser(user: InsertUser): Promise<User>
	updateUser(id: number, user: Partial<User>): Promise<User | undefined>
	listUsers(limit?: number): Promise<User[]>
	getTopUsers(limit?: number): Promise<User[]>

	// Engagement methods
	createEngagement(engagement: InsertEngagement): Promise<Engagement>
	getUserEngagements(userId: number, limit?: number): Promise<Engagement[]>
	getRecentEngagements(limit?: number): Promise<Engagement[]>

	// Achievement methods
	createAchievement(achievement: InsertAchievement): Promise<Achievement>
	getUserAchievements(userId: number): Promise<Achievement[]>

	// Stats methods
	createStat(stat: InsertStat): Promise<Stat>
	getUserStats(userId: number, period?: string): Promise<Stat[]>
}

export class MemStorage implements IStorage {
	private users = new Map<number, User>()
	private engagements = new Map<number, Engagement>()
	private achievements = new Map<number, Achievement>()
	private stats = new Map<number, Stat>()

	private counters = {
		user: 1,
		engagement: 1,
		achievement: 1,
		stat: 1,
	}

	constructor() {
		console.log('[STORAGE] Initializing empty storage')
	}

	// User methods
	async getUser(id: number): Promise<User | undefined> {
		console.log(`[STORAGE] Getting user with ID: ${id}`)
		const user = this.users.get(id)
		console.log(`[STORAGE] Found user:`, user)
		return user
	}

	async getUserByFid(fid: number): Promise<User | undefined> {
		console.log(`[STORAGE] Getting user with FID: ${fid}`)
		const user = Array.from(this.users.values()).find(user => user.fid === fid)
		console.log(`[STORAGE] Found user by FID:`, user)
		return user
	}

	async getUserByUsername(username: string): Promise<User | undefined> {
		console.log(`[STORAGE] Getting user with username: ${username}`)
		const user = Array.from(this.users.values()).find(
			user => user.username === username
		)
		console.log(`[STORAGE] Found user:`, user)
		return user
	}

	async createUser(insertUser: InsertUser): Promise<User> {
		console.log(`[STORAGE] Creating new user:`, insertUser)
		const id = this.counters.user++
		const now = new Date()
		const user: User = {
			id,
			fid: insertUser.fid,
			username: insertUser.username,
			displayName: insertUser.displayName ?? null,
			bio: insertUser.bio ?? null,
			profileImage: insertUser.profileImage ?? null,
			followerCount: insertUser.followerCount ?? null,
			followingCount: insertUser.followingCount ?? null,
			registrationDate: now,
			lastActive: now,
			totalPoints: 0,
		}
		this.users.set(id, user)
		console.log(`[STORAGE] Created user:`, user)
		return user
	}

	async updateUser(
		id: number,
		userData: Partial<User>
	): Promise<User | undefined> {
		const user = this.users.get(id)
		if (!user) return undefined

		const updatedUser = { ...user, ...userData }
		this.users.set(id, updatedUser)
		return updatedUser
	}

	async listUsers(limit = 10): Promise<User[]> {
		return Array.from(this.users.values())
			.sort((a, b) => {
				const aTime = a.lastActive?.getTime() ?? 0
				const bTime = b.lastActive?.getTime() ?? 0
				return bTime - aTime
			})
			.slice(0, limit)
	}

	async getTopUsers(limit = 5): Promise<User[]> {
		return Array.from(this.users.values())
			.sort((a, b) => {
				const aPoints = a.totalPoints ?? 0
				const bPoints = b.totalPoints ?? 0
				return bPoints - aPoints
			})
			.slice(0, limit)
	}

	// Engagement methods
	async createEngagement(
		insertEngagement: InsertEngagement
	): Promise<Engagement> {
		const id = this.counters.engagement++
		const now = new Date()
		const engagement: Engagement = {
			...insertEngagement,
			id,
			timestamp: now,
		}

		this.engagements.set(id, engagement)

		// Update user points
		const user = this.users.get(engagement.userId)
		if (user) {
			const currentPoints = user.totalPoints ?? 0
			this.users.set(user.id, {
				...user,
				totalPoints: currentPoints + engagement.points,
				lastActive: now,
			})
		}

		return engagement
	}

	async getUserEngagements(userId: number, limit = 20): Promise<Engagement[]> {
		return Array.from(this.engagements.values())
			.filter(engagement => engagement.userId === userId)
			.sort((a, b) => {
				const aTime = a.timestamp?.getTime() ?? 0
				const bTime = b.timestamp?.getTime() ?? 0
				return bTime - aTime
			})
			.slice(0, limit)
	}

	async getRecentEngagements(limit = 20): Promise<Engagement[]> {
		return Array.from(this.engagements.values())
			.sort((a, b) => {
				const aTime = a.timestamp?.getTime() ?? 0
				const bTime = b.timestamp?.getTime() ?? 0
				return bTime - aTime
			})
			.slice(0, limit)
	}

	// Achievement methods
	async createAchievement(
		insertAchievement: InsertAchievement
	): Promise<Achievement> {
		const id = this.counters.achievement++
		const now = new Date()
		const achievement: Achievement = {
			...insertAchievement,
			id,
			unlockedAt: now,
		}

		this.achievements.set(id, achievement)
		return achievement
	}

	async getUserAchievements(userId: number): Promise<Achievement[]> {
		return Array.from(this.achievements.values())
			.filter(achievement => achievement.userId === userId)
			.sort((a, b) => {
				const aTime = a.unlockedAt?.getTime() ?? 0
				const bTime = b.unlockedAt?.getTime() ?? 0
				return bTime - aTime
			})
	}

	// Stats methods
	async createStat(insertStat: InsertStat): Promise<Stat> {
		const id = this.counters.stat++
		const stat: Stat = {
			id,
			userId: insertStat.userId,
			period: insertStat.period,
			casts: insertStat.casts ?? null,
			replies: insertStat.replies ?? null,
			reactions: insertStat.reactions ?? null,
			recasts: insertStat.recasts ?? null,
			engagementRate: insertStat.engagementRate ?? null,
			startDate: insertStat.startDate,
			endDate: insertStat.endDate,
		}

		this.stats.set(id, stat)
		return stat
	}

	async getUserStats(userId: number, period?: string): Promise<Stat[]> {
		const userStats = Array.from(this.stats.values()).filter(
			stat => stat.userId === userId
		)

		if (period) {
			return userStats
				.filter(stat => stat.period === period)
				.sort((a, b) => b.startDate.getTime() - a.startDate.getTime())
		}

		return userStats.sort(
			(a, b) => b.startDate.getTime() - a.startDate.getTime()
		)
	}
}

export const storage = new MemStorage()
