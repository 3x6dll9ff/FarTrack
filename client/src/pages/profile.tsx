import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, User as UserIcon, Users, MessageSquare, Heart, Repeat, BarChart, Award, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { StatCard } from "@/components/dashboard/stat-card";
import { Separator } from "@/components/ui/separator";
import { Achievement } from "@shared/schema";

export default function Profile() {
  const { id } = useParams();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: user, isLoading: userLoading, error: userError } = useQuery({
    queryKey: [`/api/users/${id}`],
    queryFn: () => fetch(`/api/users/${id}`).then((res) => res.json()),
  });

  const { data: achievements, isLoading: achievementsLoading } = useQuery({
    queryKey: [`/api/users/${id}/achievements`],
    queryFn: () => fetch(`/api/users/${id}/achievements`).then((res) => res.json()),
  });

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: [`/api/users/${id}/stats`],
    queryFn: () => fetch(`/api/users/${id}/stats`).then((res) => res.json()),
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const calculateDaysSince = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      <Sidebar className={sidebarOpen ? "translate-x-0" : isMobile ? "-translate-x-full" : "translate-x-0"} />
      
      <main className="flex-1 overflow-x-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6">
          {userLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-48" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
                <Skeleton className="h-64 md:col-span-1" />
                <Skeleton className="h-64 md:col-span-2" />
              </div>
            </div>
          ) : userError ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Failed to load user profile</h2>
              <p className="text-gray-500 dark:text-gray-400 mt-2">Please try again later</p>
              <Button className="mt-4">Retry</Button>
            </div>
          ) : (
            <>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {user.displayName}'s Profile
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                  View detailed analytics and engagement metrics
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Card */}
                <Card>
                  <div className="p-4 text-center">
                    <div className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-primary-100 dark:border-primary-900 overflow-hidden">
                      <img
                        src={user.profileImage}
                        alt={user.displayName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{user.displayName}</h2>
                    <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>
                    
                    <div className="flex justify-center gap-4 mt-4">
                      <div className="text-center">
                        <span className="block text-lg font-semibold text-gray-900 dark:text-gray-100">{user.followerCount}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Followers</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-lg font-semibold text-gray-900 dark:text-gray-100">{user.followingCount}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Following</span>
                      </div>
                      <div className="text-center">
                        <span className="block text-lg font-semibold text-gray-900 dark:text-gray-100">{user.totalPoints}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">Points</span>
                      </div>
                    </div>
                    
                    <div className="mt-6">
                      <Badge variant="outline" className="flex items-center gap-1 mx-auto">
                        <CalendarDays className="h-3 w-3" />
                        <span>Joined {formatDate(user.registrationDate)}</span>
                      </Badge>
                    </div>
                    
                    <div className="mt-6 text-sm text-gray-600 dark:text-gray-300">
                      {user.bio || "No bio available"}
                    </div>
                  </div>
                  
                  <Separator />
                  
                  <div className="p-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Achievements ({achievements?.length || 0})
                    </h3>
                    
                    {achievementsLoading ? (
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3].map((i) => (
                          <Skeleton key={i} className="h-8 w-20" />
                        ))}
                      </div>
                    ) : achievements?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {achievements.map((achievement: Achievement) => (
                          <Badge key={achievement.id} variant="secondary" className="flex items-center gap-1">
                            <Award className="h-3 w-3" />
                            <span>{achievement.name}</span>
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No achievements yet</p>
                    )}
                  </div>
                </Card>
                
                {/* Stats and Activity */}
                <Card className="md:col-span-2">
                  <Tabs defaultValue="overview">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-800">
                      <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="overview">Overview</TabsTrigger>
                        <TabsTrigger value="activity">Activity</TabsTrigger>
                        <TabsTrigger value="achievements">Achievements</TabsTrigger>
                      </TabsList>
                    </div>
                    
                    <TabsContent value="overview" className="p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <StatCard 
                          title="Account Age" 
                          value={`${calculateDaysSince(user.registrationDate)} days`}
                          icon={<Calendar className="h-5 w-5" />}
                        />
                        <StatCard 
                          title="Engagement Rank" 
                          value={`#${user.totalPoints > 800 ? '1-5' : user.totalPoints > 500 ? '6-20' : '21+'}`}
                          icon={<BarChart className="h-5 w-5" />}
                          status={user.totalPoints > 800 ? "Top 5%" : user.totalPoints > 500 ? "Top 20%" : "Rising"}
                          statusType={user.totalPoints > 800 ? "success" : user.totalPoints > 500 ? "info" : "warning"}
                        />
                      </div>
                      
                      <h3 className="text-lg font-semibold mb-4">Engagement Summary</h3>
                      
                      {statsLoading ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-12 w-full" />
                          ))}
                        </div>
                      ) : stats ? (
                        <div className="space-y-5">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-3">
                              <MessageSquare className="h-4 w-4 text-primary-500" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">Casts</span>
                                <span className="text-sm font-semibold">{stats.reduce((sum: number, stat: any) => sum + stat.casts, 0)}</span>
                              </div>
                              <div className="mt-1 w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="bg-primary-500 h-full rounded-full" style={{ width: "72%" }} />
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
                                <span className="text-sm font-semibold">{stats.reduce((sum: number, stat: any) => sum + stat.reactions, 0)}</span>
                              </div>
                              <div className="mt-1 w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="bg-green-500 h-full rounded-full" style={{ width: "85%" }} />
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
                                <span className="text-sm font-semibold">{stats.reduce((sum: number, stat: any) => sum + stat.recasts, 0)}</span>
                              </div>
                              <div className="mt-1 w-full h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div className="bg-blue-500 h-full rounded-full" style={{ width: "64%" }} />
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <p className="text-gray-500 dark:text-gray-400">No activity data available</p>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="activity" className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Recent Activity</h3>
                        <Button variant="outline" size="sm">Filter</Button>
                      </div>
                      
                      {statsLoading ? (
                        <div className="space-y-4">
                          {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-24 w-full" />
                          ))}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-start">
                              <MessageSquare className="h-5 w-5 text-primary-500 mt-1 mr-3" />
                              <div>
                                <p className="text-sm text-gray-800 dark:text-gray-200">Cast created about Web3 analytics tools</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 days ago • 24 reactions</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-start">
                              <Award className="h-5 w-5 text-amber-500 mt-1 mr-3" />
                              <div>
                                <p className="text-sm text-gray-800 dark:text-gray-200">Earned "Conversation Starter" achievement</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">5 days ago</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-start">
                              <Users className="h-5 w-5 text-green-500 mt-1 mr-3" />
                              <div>
                                <p className="text-sm text-gray-800 dark:text-gray-200">Reached 1000 followers milestone</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2 weeks ago</p>
                              </div>
                            </div>
                          </div>
                          
                          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <div className="flex items-start">
                              <Heart className="h-5 w-5 text-red-500 mt-1 mr-3" />
                              <div>
                                <p className="text-sm text-gray-800 dark:text-gray-200">Received 100+ reactions in a single day</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">3 weeks ago</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="achievements" className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Achievements</h3>
                        <Badge variant="outline">{achievements?.length || 0} Earned</Badge>
                      </div>
                      
                      {achievementsLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-32 w-full" />
                          ))}
                        </div>
                      ) : achievements?.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {achievements.map((achievement: Achievement) => (
                            <Card key={achievement.id}>
                              <CardContent className="p-4 flex items-center">
                                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900 flex items-center justify-center mr-4 flex-shrink-0">
                                  <Award className="h-6 w-6 text-primary-500" />
                                </div>
                                <div>
                                  <h4 className="font-medium text-gray-900 dark:text-gray-100">{achievement.name}</h4>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">{achievement.description}</p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    Unlocked {formatDate(achievement.unlockedAt)}
                                  </p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-12">
                          <Award className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No Achievements Yet</h3>
                          <p className="text-gray-500 dark:text-gray-400 mt-2">
                            Keep engaging with the community to earn achievements
                          </p>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </Card>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
