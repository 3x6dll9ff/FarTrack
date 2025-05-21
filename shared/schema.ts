import { integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema } from 'drizzle-zod'

export const users = pgTable('users', {
	id: serial('id').primaryKey(),
	username: text('username').notNull().unique(),
	displayName: text('display_name'),
	bio: text('bio'),
	profileImage: text('profile_image'),
	followerCount: integer('follower_count').default(0),
	followingCount: integer('following_count').default(0),
	registrationDate: timestamp('registration_date').defaultNow(),
	lastActive: timestamp('last_active').defaultNow(),
	totalPoints: integer('total_points').default(0),
	fid: integer('fid').notNull(),
})

export const engagements = pgTable('engagements', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	type: text('type').notNull(), // cast, reply, reaction, recast
	points: integer('points').notNull(),
	timestamp: timestamp('timestamp').defaultNow(),
})

export const achievements = pgTable('achievements', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	name: text('name').notNull(),
	description: text('description').notNull(),
	icon: text('icon').notNull(),
	unlockedAt: timestamp('unlocked_at').defaultNow(),
})

export const stats = pgTable('stats', {
	id: serial('id').primaryKey(),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	period: text('period').notNull(), // daily, weekly, monthly
	casts: integer('casts').default(0),
	replies: integer('replies').default(0),
	reactions: integer('reactions').default(0),
	recasts: integer('recasts').default(0),
	engagementRate: integer('engagement_rate').default(0),
	startDate: timestamp('start_date').notNull(),
	endDate: timestamp('end_date').notNull(),
})

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
	id: true,
	totalPoints: true,
	registrationDate: true,
	lastActive: true,
	fid: true,
})

export const insertEngagementSchema = createInsertSchema(engagements).omit({
	id: true,
	timestamp: true,
})

export const insertAchievementSchema = createInsertSchema(achievements).omit({
	id: true,
	unlockedAt: true,
})

export const insertStatSchema = createInsertSchema(stats).omit({
	id: true,
})

// Types
export type User = typeof users.$inferSelect
export type InsertUser = {
	username: string
	fid: number
	displayName?: string | null
	bio?: string | null
	profileImage?: string | null
	followerCount?: number | null
	followingCount?: number | null
}

export type Engagement = typeof engagements.$inferSelect
export type InsertEngagement = {
	userId: number
	type: string
	points: number
}

export type Achievement = typeof achievements.$inferSelect
export type InsertAchievement = {
	userId: number
	name: string
	description: string
	icon: string
}

export type Stat = typeof stats.$inferSelect
export type InsertStat = {
	userId: number
	period: string
	casts?: number | null
	replies?: number | null
	reactions?: number | null
	recasts?: number | null
	engagementRate?: number | null
	startDate: Date
	endDate: Date
}

// Export schemas
export const InsertUser = insertUserSchema
export const InsertEngagement = insertEngagementSchema
export const InsertAchievement = insertAchievementSchema
export const InsertStat = insertStatSchema
