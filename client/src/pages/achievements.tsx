import { useState } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { PageTitle } from "@/components/layout/page-title";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Calendar, CheckCircle, Flame, Lock, MessageSquare, Star, Trophy, Users, Clock, Heart, Repeat, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { Achievement, User } from "@shared/schema";

// Achievement components
interface AchievementCardProps {
  achievement: Achievement;
  user?: User;
}

function AchievementCard({ achievement }: AchievementCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const iconMapping: Record<string, React.ReactNode> = {
    rocket: <Flame className="h-6 w-6" />,
    message: <MessageSquare className="h-6 w-6" />,
    users: <Users className="h-6 w-6" />,
    star: <Star className="h-6 w-6" />,
    heart: <Heart className="h-6 w-6" />,
    trophy: <Trophy className="h-6 w-6" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="overflow-hidden">
        <div className="bg-primary-50 dark:bg-primary-900/30 p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-800 dark:text-primary-300 flex items-center justify-center">
            {iconMapping[achievement.icon] || <Award className="h-6 w-6" />}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">{achievement.name}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
          </div>
        </div>
        <CardFooter className="px-4 py-3 bg-white dark:bg-gray-800 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center">
            <Calendar className="h-3.5 w-3.5 mr-1.5" />
            Unlocked on {formatDate(achievement.unlockedAt)}
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

interface LockedAchievementProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  progress?: number;
}

function LockedAchievement({ title, description, icon, progress = 0 }: LockedAchievementProps) {
  return (
    <Card className="overflow-hidden opacity-80 hover:opacity-100 transition-opacity">
      <div className="p-4 flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 flex items-center justify-center">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300">{title}</h3>
            <Badge variant="outline" className="text-xs font-normal">
              <Lock className="h-3 w-3 mr-1" />
              <span>Locked</span>
            </Badge>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
          
          {progress > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400">Progress</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

export default function Achievements() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userId, setUserId] = useState(1); // Default to first user

  // Fetch user data
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: [`/api/users/${userId}`],
    queryFn: () => fetch(`/api/users/${userId}`).then((res) => res.json()),
  });

  // Fetch achievements data
  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: [`/api/users/${userId}/achievements`],
    queryFn: () => fetch(`/api/users/${userId}/achievements`).then((res) => res.json()),
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      <Sidebar className={sidebarOpen ? "translate-x-0" : isMobile ? "-translate-x-full" : "translate-x-0"} />
      
      <main className="flex-1 overflow-x-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          <PageTitle 
            title="Achievements" 
            description="Track your milestones and unlock rewards through engagement"
          />
          
          {/* Achievement Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Achievements</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100">
                      {achievementsLoading ? <Skeleton className="h-8 w-12" /> : achievements?.length || 0}
                    </h3>
                  </div>
                  <div className="bg-primary-100 text-primary-600 p-2 rounded-lg dark:bg-primary-900 dark:text-primary-300">
                    <Trophy className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Points Earned</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100">
                      {userLoading ? <Skeleton className="h-8 w-20" /> : userData?.totalPoints || 0}
                    </h3>
                  </div>
                  <div className="bg-amber-100 text-amber-600 p-2 rounded-lg dark:bg-amber-900 dark:text-amber-300">
                    <Star className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Rank</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100">
                      {userLoading ? <Skeleton className="h-8 w-24" /> : "Top 15%"}
                    </h3>
                  </div>
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg dark:bg-green-900 dark:text-green-300">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Next Achievement</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-900 dark:text-gray-100">
                      {achievementsLoading ? <Skeleton className="h-8 w-24" /> : "75% Complete"}
                    </h3>
                  </div>
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg dark:bg-blue-900 dark:text-blue-300">
                    <Clock className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-3 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
                  <motion.div 
                    className="h-full bg-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 0.8 }}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Achievements Tabs */}
          <Tabs defaultValue="earned" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="earned">Earned</TabsTrigger>
              <TabsTrigger value="progress">In Progress</TabsTrigger>
              <TabsTrigger value="locked">Locked</TabsTrigger>
            </TabsList>
            
            {/* Earned Achievements */}
            <TabsContent value="earned" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Earned Achievements</h2>
                <Badge variant="outline">
                  {achievementsLoading ? <Skeleton className="h-4 w-8" /> : `${achievements?.length || 0}/15`}
                </Badge>
              </div>
              
              {achievementsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array(6).fill(0).map((_, i) => (
                    <Skeleton key={i} className="h-32" />
                  ))}
                </div>
              ) : achievements?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {achievements.map((achievement: Achievement) => (
                    <AchievementCard key={achievement.id} achievement={achievement} user={userData} />
                  ))}
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <div className="mx-auto w-16 h-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center dark:bg-gray-800 dark:text-gray-500 mb-4">
                    <Trophy className="h-8 w-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">No Achievements Yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-6">
                    Start engaging more with the community to earn your first achievement.
                  </p>
                  <Button>View Opportunities</Button>
                </Card>
              )}
            </TabsContent>
            
            {/* In Progress Achievements */}
            <TabsContent value="progress" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Achievements In Progress</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <LockedAchievement 
                  title="Consistent Creator" 
                  description="Post at least one cast every day for a week" 
                  icon={<Flame className="h-6 w-6" />}
                  progress={75}
                />
                
                <LockedAchievement 
                  title="Engagement Master" 
                  description="Receive 100+ reactions on a single cast" 
                  icon={<Heart className="h-6 w-6" />}
                  progress={65}
                />
                
                <LockedAchievement 
                  title="Community Builder" 
                  description="Reach 2000 followers on your profile" 
                  icon={<Users className="h-6 w-6" />}
                  progress={83}
                />
                
                <LockedAchievement 
                  title="Content Curator" 
                  description="Recast 50 quality posts from other users" 
                  icon={<Repeat className="h-6 w-6" />}
                  progress={42}
                />
              </div>
            </TabsContent>
            
            {/* Locked Achievements */}
            <TabsContent value="locked" className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Locked Achievements</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <LockedAchievement 
                  title="Power User" 
                  description="Spend 100+ hours on Farcaster" 
                  icon={<Zap className="h-6 w-6" />}
                />
                
                <LockedAchievement 
                  title="Thought Leader" 
                  description="Have a cast with 500+ recasts" 
                  icon={<Repeat className="h-6 w-6" />}
                />
                
                <LockedAchievement 
                  title="Conversation Starter" 
                  description="Have a thread with 50+ replies" 
                  icon={<MessageSquare className="h-6 w-6" />}
                />
                
                <LockedAchievement 
                  title="Top Creator" 
                  description="Reach the top 10 users on engagement rate" 
                  icon={<Trophy className="h-6 w-6" />}
                />
                
                <LockedAchievement 
                  title="Verified Creator" 
                  description="Get verified status on your profile" 
                  icon={<CheckCircle className="h-6 w-6" />}
                />
                
                <LockedAchievement 
                  title="Community Champion" 
                  description="Receive 10+ mentions in a day" 
                  icon={<Star className="h-6 w-6" />}
                />
              </div>
            </TabsContent>
          </Tabs>
          
          {/* Achievement Levels */}
          <Card>
            <CardHeader>
              <CardTitle>Achievement Levels</CardTitle>
              <CardDescription>Earn points to level up and unlock new benefits</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 w-8 h-8 rounded-full flex items-center justify-center">
                        1
                      </div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Newcomer</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">0-500 points</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-400 w-8 h-8 rounded-full flex items-center justify-center">
                        2
                      </div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Explorer</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">500-1000 points</span>
                  </div>
                  <Progress value={100} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-400 w-8 h-8 rounded-full flex items-center justify-center">
                        3
                      </div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Creator</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">1000-2500 points</span>
                  </div>
                  <Progress value={30} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-amber-100 text-amber-600 dark:bg-amber-800 dark:text-amber-400 w-8 h-8 rounded-full flex items-center justify-center">
                        4
                      </div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Influencer</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">2500-5000 points</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-400 w-8 h-8 rounded-full flex items-center justify-center">
                        5
                      </div>
                      <span className="font-medium text-gray-900 dark:text-gray-100">Thought Leader</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">5000+ points</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          {/* Points System */}
          <Card>
            <CardHeader>
              <CardTitle>Points System</CardTitle>
              <CardDescription>How to earn points through Farcaster engagement</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300 w-8 h-8 rounded-full flex items-center justify-center">
                      <MessageSquare className="h-4 w-4" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Creating Content</h3>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li className="flex items-center justify-between">
                      <span>New cast</span>
                      <span className="font-semibold">+10 pts</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Thread (3+ casts)</span>
                      <span className="font-semibold">+25 pts</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>First daily cast</span>
                      <span className="font-semibold">+5 pts</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300 w-8 h-8 rounded-full flex items-center justify-center">
                      <Heart className="h-4 w-4" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Reactions</h3>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li className="flex items-center justify-between">
                      <span>Receiving reactions</span>
                      <span className="font-semibold">+2 pts each</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>100+ reactions on cast</span>
                      <span className="font-semibold">+50 pts</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Giving reactions</span>
                      <span className="font-semibold">+1 pt (max 20/day)</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300 w-8 h-8 rounded-full flex items-center justify-center">
                      <Repeat className="h-4 w-4" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Recasts & Replies</h3>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li className="flex items-center justify-between">
                      <span>Getting recasted</span>
                      <span className="font-semibold">+5 pts each</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Receiving replies</span>
                      <span className="font-semibold">+3 pts each</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Making replies</span>
                      <span className="font-semibold">+2 pts each</span>
                    </li>
                  </ul>
                </div>
                
                <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300 w-8 h-8 rounded-full flex items-center justify-center">
                      <Users className="h-4 w-4" />
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">Growth</h3>
                  </div>
                  <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                    <li className="flex items-center justify-between">
                      <span>New follower</span>
                      <span className="font-semibold">+3 pts each</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>100 follower milestone</span>
                      <span className="font-semibold">+100 pts</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span>Daily activity streak</span>
                      <span className="font-semibold">+5 pts per day</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
