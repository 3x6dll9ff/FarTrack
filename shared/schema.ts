import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  displayName: text("display_name"),
  bio: text("bio"),
  profileImage: text("profile_image"),
  followerCount: integer("follower_count").default(0),
  followingCount: integer("following_count").default(0),
  registrationDate: timestamp("registration_date").defaultNow(),
  lastActive: timestamp("last_active").defaultNow(),
  totalPoints: integer("total_points").default(0),
});

export const engagements = pgTable("engagements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // cast, reply, reaction, recast
  points: integer("points").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  unlockedAt: timestamp("unlocked_at").defaultNow(),
});

export const stats = pgTable("stats", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  period: text("period").notNull(), // daily, weekly, monthly
  casts: integer("casts").default(0),
  replies: integer("replies").default(0),
  reactions: integer("reactions").default(0),
  recasts: integer("recasts").default(0),
  engagementRate: integer("engagement_rate").default(0),
  startDate: timestamp("start_date").notNull(),
  endDate: timestamp("end_date").notNull(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  totalPoints: true,
  registrationDate: true,
  lastActive: true,
});

export const insertEngagementSchema = createInsertSchema(engagements).omit({
  id: true,
  timestamp: true,
});

export const insertAchievementSchema = createInsertSchema(achievements).omit({
  id: true,
  unlockedAt: true,
});

export const insertStatSchema = createInsertSchema(stats).omit({
  id: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Engagement = typeof engagements.$inferSelect;
export type InsertEngagement = z.infer<typeof insertEngagementSchema>;

export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;

export type Stat = typeof stats.$inferSelect;
export type InsertStat = z.infer<typeof insertStatSchema>;
