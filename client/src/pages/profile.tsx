import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { AppLayout } from "@/components/layout/app-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Award, BarChart2, CalendarDays, MessageSquare, Heart, Repeat, User as UserIcon } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Achievement } from "@shared/schema";

export default function Profile() {
  const { id } = useParams();
  const userId = id ? parseInt(id) : 1;

  // Fetch user data
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: [`/api/users/${userId}`],
    queryFn: () => fetch(`/api/users/${userId}`).then((res) => res.json()),
  });

  // Fetch achievements
  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: [`/api/users/${userId}/achievements`],
    queryFn: () => fetch(`/api/users/${userId}/achievements`).then((res) => res.json()),
  });

  // Fetch stats
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: [`/api/users/${userId}/stats`],
    queryFn: () => fetch(`/api/users/${userId}/stats`).then((res) => res.json()),
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const calculateDaysSince = (dateString: string) => {
    if (!dateString) return 0;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <AppLayout title="Profile">
      <div className="p-4 space-y-5">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 h-20"></div>
          <div className="px-4 pb-4 relative">
            <div className="absolute -top-10 left-4 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden">
              {userLoading ? (
                <Skeleton className="h-20 w-20 rounded-full" />
              ) : (
                <img 
                  src={user?.profileImage} 
                  alt={user?.displayName || user?.username} 
                  className="h-20 w-20 object-cover"
                />
              )}
            </div>
            
            <div className="mt-12">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {userLoading ? <Skeleton className="h-6 w-32" /> : user?.displayName}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    {userLoading ? <Skeleton className="h-4 w-24" /> : `@${user?.username}`}
                  </p>
                </div>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                  <UserIcon className="h-3.5 w-3.5" />
                  <span>View on Warpcast</span>
                </Button>
              </div>
              
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
                {userLoading ? (
                  <Skeleton className="h-4 w-full" />
                ) : (
                  user?.bio || "No bio available"
                )}
              </p>
              
              <div className="flex items-center gap-2 mt-3">
                <Badge variant="outline" className="flex items-center gap-1">
                  <CalendarDays className="h-3 w-3" />
                  <span>
                    {userLoading ? (
                      <Skeleton className="h-3 w-20 inline-block" />
                    ) : (
                      `Joined ${formatDate(user?.registrationDate)}`
                    )}
                  </span>
                </Badge>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Award className="h-3 w-3" />
                  <span>
                    {userLoading ? (
                      <Skeleton className="h-3 w-16 inline-block" />
                    ) : (
                      `${user?.totalPoints || 0} points`
                    )}
                  </span>
                </Badge>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3">
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold">
                {userLoading ? <Skeleton className="h-8 w-12 mx-auto" /> : user?.followerCount || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Followers</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold">
                {userLoading ? <Skeleton className="h-8 w-12 mx-auto" /> : user?.followingCount || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Following</div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold">
                {achievementsLoading ? <Skeleton className="h-8 w-12 mx-auto" /> : achievements?.length || 0}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Achievements</div>
            </CardContent>
          </Card>
        </div>
        
        {/* Tabs Section */}
        <Tabs defaultValue="stats">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>
          
          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-4 mt-4">
            <h3 className="text-lg font-semibold">Engagement Stats</h3>
            
            {statsLoading ? (
              <div className="space-y-4">
                {Array(4).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : stats && stats.length > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
                    <MessageSquare className="h-4 w-4 text-primary-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Casts</span>
                      <span className="text-sm font-semibold">
                        {stats.reduce((sum, stat: any) => sum + (stat.casts || 0), 0)}
                      </span>
                    </div>
                    <div className="mt-1 w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        className="bg-primary-500 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '72%' }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                    <Heart className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Reactions</span>
                      <span className="text-sm font-semibold">
                        {stats.reduce((sum, stat: any) => sum + (stat.reactions || 0), 0)}
                      </span>
                    </div>
                    <div className="mt-1 w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        className="bg-green-500 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '85%' }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900 flex items-center justify-center mr-3">
                    <MessageSquare className="h-4 w-4 text-amber-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Replies</span>
                      <span className="text-sm font-semibold">
                        {stats.reduce((sum, stat: any) => sum + (stat.replies || 0), 0)}
                      </span>
                    </div>
                    <div className="mt-1 w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        className="bg-amber-500 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '62%' }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                    <Repeat className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Recasts</span>
                      <span className="text-sm font-semibold">
                        {stats.reduce((sum, stat: any) => sum + (stat.recasts || 0), 0)}
                      </span>
                    </div>
                    <div className="mt-1 w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <motion.div 
                        className="bg-blue-500 h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '45%' }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Card className="p-6 text-center">
                <BarChart2 className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">No Stats Available</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Stats will appear as you engage with Farcaster.
                </p>
              </Card>
            )}
          </TabsContent>
          
          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-4 mt-4">
            <h3 className="text-lg font-semibold">
              Achievements
              {!achievementsLoading && (
                <Badge className="ml-2 text-xs px-2" variant="outline">
                  {achievements?.length || 0}/15
                </Badge>
              )}
            </h3>
            
            {achievementsLoading ? (
              <div className="space-y-3">
                {Array(3).fill(0).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : achievements?.length > 0 ? (
              <div className="space-y-3">
                {achievements.map((achievement: Achievement) => (
                  <Card key={achievement.id} className="overflow-hidden">
                    <div className="p-3 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 dark:bg-primary-900 dark:text-primary-300 flex items-center justify-center flex-shrink-0">
                        <Award className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-sm">{achievement.name}</h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
                        <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          <span>{formatDate(achievement.unlockedAt)}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-6 text-center">
                <Award className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium mb-2">No Achievements Yet</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Engage with Farcaster to earn achievements.
                </p>
                <Button size="sm">View Opportunities</Button>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}