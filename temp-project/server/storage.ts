import { 
  User, InsertUser, 
  Engagement, InsertEngagement, 
  Achievement, InsertAchievement,
  Stat, InsertStat
} from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  listUsers(limit?: number): Promise<User[]>;
  getTopUsers(limit?: number): Promise<User[]>;

  // Engagement methods
  createEngagement(engagement: InsertEngagement): Promise<Engagement>;
  getUserEngagements(userId: number, limit?: number): Promise<Engagement[]>;
  getRecentEngagements(limit?: number): Promise<Engagement[]>;

  // Achievement methods
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  getUserAchievements(userId: number): Promise<Achievement[]>;
  
  // Stats methods
  createStat(stat: InsertStat): Promise<Stat>;
  getUserStats(userId: number, period?: string): Promise<Stat[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private engagements: Map<number, Engagement>;
  private achievements: Map<number, Achievement>;
  private stats: Map<number, Stat>;
  private userIdCounter: number;
  private engagementIdCounter: number;
  private achievementIdCounter: number;
  private statIdCounter: number;

  constructor() {
    this.users = new Map();
    this.engagements = new Map();
    this.achievements = new Map();
    this.stats = new Map();
    this.userIdCounter = 1;
    this.engagementIdCounter = 1;
    this.achievementIdCounter = 1;
    this.statIdCounter = 1;
    
    // Add sample data for development
    this.initializeData();
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = {
      ...insertUser,
      id,
      registrationDate: now,
      lastActive: now,
      totalPoints: 0,
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async listUsers(limit: number = 10): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.lastActive.getTime() - a.lastActive.getTime())
      .slice(0, limit);
  }

  async getTopUsers(limit: number = 5): Promise<User[]> {
    return Array.from(this.users.values())
      .sort((a, b) => b.totalPoints - a.totalPoints)
      .slice(0, limit);
  }

  // Engagement methods
  async createEngagement(insertEngagement: InsertEngagement): Promise<Engagement> {
    const id = this.engagementIdCounter++;
    const now = new Date();
    const engagement: Engagement = {
      ...insertEngagement,
      id,
      timestamp: now,
    };
    
    this.engagements.set(id, engagement);
    
    // Update user points
    const user = this.users.get(engagement.userId);
    if (user) {
      const updatedUser = {
        ...user,
        totalPoints: user.totalPoints + engagement.points,
        lastActive: now,
      };
      this.users.set(user.id, updatedUser);
    }
    
    return engagement;
  }

  async getUserEngagements(userId: number, limit: number = 20): Promise<Engagement[]> {
    return Array.from(this.engagements.values())
      .filter((engagement) => engagement.userId === userId)
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }
  
  async getRecentEngagements(limit: number = 20): Promise<Engagement[]> {
    return Array.from(this.engagements.values())
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  // Achievement methods
  async createAchievement(insertAchievement: InsertAchievement): Promise<Achievement> {
    const id = this.achievementIdCounter++;
    const now = new Date();
    const achievement: Achievement = {
      ...insertAchievement,
      id,
      unlockedAt: now,
    };
    
    this.achievements.set(id, achievement);
    return achievement;
  }

  async getUserAchievements(userId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter((achievement) => achievement.userId === userId)
      .sort((a, b) => b.unlockedAt.getTime() - a.unlockedAt.getTime());
  }

  // Stats methods
  async createStat(insertStat: InsertStat): Promise<Stat> {
    const id = this.statIdCounter++;
    const stat: Stat = {
      ...insertStat,
      id,
    };
    
    this.stats.set(id, stat);
    return stat;
  }

  async getUserStats(userId: number, period?: string): Promise<Stat[]> {
    const userStats = Array.from(this.stats.values())
      .filter((stat) => stat.userId === userId);
      
    if (period) {
      return userStats.filter((stat) => stat.period === period)
        .sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
    }
    
    return userStats.sort((a, b) => b.startDate.getTime() - a.startDate.getTime());
  }

  // Initialize with sample data
  private initializeData() {
    // Sample users
    const users: InsertUser[] = [
      {
        username: "alice",
        displayName: "Alice Wilson",
        bio: "Product Manager | Web3 Enthusiast",
        profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        followerCount: 1024,
        followingCount: 512,
      },
      {
        username: "bob",
        displayName: "Bob Johnson",
        bio: "Software Engineer | Blockchain Developer",
        profileImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        followerCount: 856,
        followingCount: 302,
      },
      {
        username: "carol",
        displayName: "Carol Martinez",
        bio: "Designer & Artist | NFT Creator",
        profileImage: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        followerCount: 1532,
        followingCount: 218,
      },
      {
        username: "dave",
        displayName: "Dave Williams",
        bio: "Crypto Analyst | DeFi Researcher",
        profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        followerCount: 2104,
        followingCount: 350,
      },
      {
        username: "emma",
        displayName: "Emma Lee",
        bio: "Community Manager | Web3 Advocate",
        profileImage: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
        followerCount: 1876,
        followingCount: 415,
      }
    ];
    
    // Create users with different registration dates and points
    const now = new Date();
    const dayInMs = 24 * 60 * 60 * 1000;
    
    users.forEach((user, index) => {
      const id = this.userIdCounter++;
      const regDate = new Date(now.getTime() - (90 - index * 15) * dayInMs);
      const lastActive = new Date(now.getTime() - index * dayInMs / 2);
      const totalPoints = 1000 - index * 150;
      
      this.users.set(id, {
        ...user,
        id,
        registrationDate: regDate,
        lastActive: lastActive,
        totalPoints: totalPoints
      });
      
      // Add engagements for each user
      const engagementTypes = ["cast", "reply", "reaction", "recast"];
      const engagementPoints = { "cast": 10, "reply": 5, "reaction": 2, "recast": 8 };
      
      for (let i = 0; i < 5 + index; i++) {
        const type = engagementTypes[Math.floor(Math.random() * engagementTypes.length)];
        const engagementDate = new Date(now.getTime() - (Math.random() * 30) * dayInMs);
        
        this.engagements.set(this.engagementIdCounter++, {
          id: this.engagementIdCounter,
          userId: id,
          type: type,
          points: engagementPoints[type as keyof typeof engagementPoints],
          timestamp: engagementDate
        });
      }
      
      // Add some achievements
      const achievements = [
        {
          name: "Early Adopter",
          description: "Joined Farcaster in the early days",
          icon: "rocket"
        },
        {
          name: "Conversation Starter",
          description: "Created 10+ casts with replies",
          icon: "message"
        },
        {
          name: "Influencer",
          description: "Reached 1000+ followers",
          icon: "users"
        }
      ];
      
      achievements.forEach((achievement, achieveIndex) => {
        if (Math.random() > 0.3) {
          const unlockedDate = new Date(now.getTime() - (Math.random() * 60) * dayInMs);
          
          this.achievements.set(this.achievementIdCounter++, {
            id: this.achievementIdCounter,
            userId: id,
            name: achievement.name,
            description: achievement.description,
            icon: achievement.icon,
            unlockedAt: unlockedDate
          });
        }
      });
      
      // Add stats for different periods
      const periods = ["daily", "weekly", "monthly"];
      
      periods.forEach((period) => {
        let daysOffset = period === "daily" ? 1 : period === "weekly" ? 7 : 30;
        
        for (let i = 0; i < 3; i++) {
          const startDate = new Date(now.getTime() - (daysOffset * (i + 1)) * dayInMs);
          const endDate = new Date(startDate.getTime() + daysOffset * dayInMs);
          
          this.stats.set(this.statIdCounter++, {
            id: this.statIdCounter,
            userId: id,
            period: period,
            casts: Math.floor(Math.random() * 20),
            replies: Math.floor(Math.random() * 30),
            reactions: Math.floor(Math.random() * 50),
            recasts: Math.floor(Math.random() * 15),
            engagementRate: Math.floor(Math.random() * 100),
            startDate: startDate,
            endDate: endDate
          });
        }
      });
    });
  }
}

export const storage = new MemStorage();
