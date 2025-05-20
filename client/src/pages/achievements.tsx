import { useState } from "react";
import { AppLayout } from "@/components/layout/app-layout";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, Calendar, CheckCircle, Flame, Lock, MessageSquare, Star, Trophy, Users, Clock, Heart, Repeat, Zap, Gift } from "lucide-react";
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
      month: 'short',
      day: 'numeric'
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
        <div className="p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300 flex items-center justify-center flex-shrink-0">
            {iconMapping[achievement.icon] || <Award className="h-5 w-5" />}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{achievement.name}</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
            <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
              <Calendar className="h-3 w-3 mr-1" />
              <span>{formatDate(achievement.unlockedAt)}</span>
            </div>
          </div>
        </div>
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
      <div className="p-3 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500 flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-700 dark:text-gray-300 text-sm">{title}</h3>
            <Badge variant="outline" className="text-[10px] font-normal py-0 h-4">
              <Lock className="h-2.5 w-2.5 mr-1" />
              <span>Locked</span>
            </Badge>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
          
          {progress > 0 && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500 dark:text-gray-400 text-[10px]">Progress</span>
                <span className="text-gray-700 dark:text-gray-300 font-medium text-[10px]">{progress}%</span>
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
    <AppLayout title="Earn Points">
      <div className="p-4 space-y-5">
        {/* Баннер */}
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl p-5 shadow-md">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-white/20 rounded-lg mr-3">
              <Gift className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold">Earn & Collect</h2>
          </div>
          <p className="text-amber-100 mb-3">Engage with the Farcaster community to earn rewards</p>
          <div className="flex justify-between">
            <div>
              <div className="text-xs text-amber-200">Total Points</div>
              <div className="text-2xl font-bold">{userData?.totalPoints || 0}</div>
            </div>
            <div>
              <div className="text-xs text-amber-200">Achievements</div>
              <div className="text-2xl font-bold">{achievements?.length || 0}</div>
            </div>
          </div>
        </div>
        
        {/* Daily Challenges */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Daily Challenges</h2>
            <Badge className="bg-green-500">+50 points</Badge>
          </div>
          
          <div className="space-y-3">
            <Card>
              <div className="p-3 flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300 flex items-center justify-center mr-3">
                  <MessageSquare className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Create 3 casts</h3>
                  <Progress value={66} className="h-1.5 mt-1" />
                </div>
                <div className="text-xs ml-3">2/3</div>
              </div>
            </Card>
            
            <Card>
              <div className="p-3 flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300 flex items-center justify-center mr-3">
                  <Heart className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">React to 5 casts</h3>
                  <Progress value={100} className="h-1.5 mt-1" />
                </div>
                <div className="text-xs ml-3">5/5</div>
              </div>
            </Card>
            
            <Card>
              <div className="p-3 flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300 flex items-center justify-center mr-3">
                  <Repeat className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-sm">Recast 2 posts</h3>
                  <Progress value={50} className="h-1.5 mt-1" />
                </div>
                <div className="text-xs ml-3">1/2</div>
              </div>
            </Card>
          </div>
        </div>

        {/* Achievements Tabs */}
        <Tabs defaultValue="earned" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="earned">Earned</TabsTrigger>
            <TabsTrigger value="progress">In Progress</TabsTrigger>
          </TabsList>
          
          {/* Earned Achievements */}
          <TabsContent value="earned" className="space-y-4">
            {achievementsLoading ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-20" />
                ))}
              </div>
            ) : achievements?.length > 0 ? (
              <div className="space-y-3">
                {achievements.map((achievement: Achievement) => (
                  <AchievementCard key={achievement.id} achievement={achievement} user={userData} />
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <div className="mx-auto w-14 h-14 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center dark:bg-gray-800 dark:text-gray-500 mb-3">
                  <Trophy className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold mb-2">No Achievements Yet</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Start engaging to earn your first achievement.
                </p>
                <Button size="sm">View Opportunities</Button>
              </Card>
            )}
          </TabsContent>
          
          {/* In Progress Achievements */}
          <TabsContent value="progress" className="space-y-4">              
            <div className="space-y-3">
              <LockedAchievement 
                title="Consistent Creator" 
                description="Post at least one cast every day for a week" 
                icon={<Flame className="h-5 w-5" />}
                progress={75}
              />
              
              <LockedAchievement 
                title="Engagement Master" 
                description="Receive 100+ reactions on a single cast" 
                icon={<Heart className="h-5 w-5" />}
                progress={65}
              />
              
              <LockedAchievement 
                title="Community Builder" 
                description="Reach 2000 followers on your profile" 
                icon={<Users className="h-5 w-5" />}
                progress={83}
              />
              
              <LockedAchievement 
                title="Content Curator" 
                description="Recast 50 quality posts from other users" 
                icon={<Repeat className="h-5 w-5" />}
                progress={42}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Achievement Levels */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Achievement Levels</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      1
                    </div>
                    <span className="font-medium text-sm">Newcomer</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">0-500 pts</span>
                </div>
                <Progress value={100} className="h-1.5" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      2
                    </div>
                    <span className="font-medium text-sm">Regular</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">500-1000 pts</span>
                </div>
                <Progress value={userData?.totalPoints ? ((userData.totalPoints - 500) / 5) : 0} className="h-1.5" />
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <div className="bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 w-6 h-6 rounded-full flex items-center justify-center text-xs">
                      3
                    </div>
                    <span className="font-medium text-sm">Elite</span>
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400">1000+ pts</span>
                </div>
                <Progress value={0} className="h-1.5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}