import { AppLayout } from "@/components/layout/app-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, BarChart2, Users, Award, ArrowUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

export default function Dashboard() {
  // Получение данных пользователя
  const { data: userData } = useQuery({
    queryKey: ["/api/users/1"],
    queryFn: () => fetch("/api/users/1").then((res) => res.json()),
  });

  // Получение статистики
  const { data: statsData } = useQuery({
    queryKey: ["/api/users/1/stats", "summary"],
    queryFn: () => fetch("/api/users/1/stats").then((res) => res.json()),
  });

  // Получение достижений
  const { data: achievements } = useQuery({
    queryKey: ["/api/users/1/achievements"],
    queryFn: () => fetch("/api/users/1/achievements").then((res) => res.json()),
  });

  // Подготовка данных для графика
  const chartData = statsData ? statsData.slice(0, 7).map((stat: any) => ({
    name: new Date(stat.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    points: stat.casts * 10 + stat.replies * 5 + stat.reactions * 2 + stat.recasts * 8,
  })) : [];

  return (
    <AppLayout title="FarTrack">
      <div className="p-4 space-y-6">
        {/* Баннер */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white rounded-xl p-5 shadow-md">
          <div className="flex items-center mb-3">
            <div className="p-2 bg-white/20 rounded-lg mr-3">
              <Award className="h-6 w-6" />
            </div>
            <h2 className="text-xl font-bold">Welcome, {userData?.displayName || 'User'}!</h2>
          </div>
          <p className="text-primary-100 mb-3">Track your Farcaster engagement and earn rewards</p>
          <div className="bg-white/10 rounded-lg p-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Daily Points Progress</span>
              <span className="text-sm font-medium">72/100</span>
            </div>
            <Progress value={72} className="h-2" />
          </div>
        </div>
        
        {/* Счетчики */}
        <div className="grid grid-cols-2 gap-4">
          <StatCard 
            title="Total Points" 
            value={userData?.totalPoints || 0}
            status="+12%"
            statusType="success"
            icon={<BarChart2 className="h-5 w-5" />}
          />
          
          <StatCard 
            title="Followers" 
            value={userData?.followerCount || 0}
            status="+5%"
            statusType="success"
            icon={<Users className="h-5 w-5" />}
          />
        </div>
        
        {/* Активность */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Points Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366F1" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="points" 
                    stroke="#6366F1" 
                    fill="url(#colorPoints)" 
                    strokeWidth={2}
                  />
                  <XAxis dataKey="name" tick={{fontSize: 10}} axisLine={false} tickLine={false} />
                  <YAxis 
                    tick={{fontSize: 10}} 
                    axisLine={false} 
                    tickLine={false} 
                    orientation="right" 
                  />
                  <Tooltip />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        {/* Достижения */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold">Recent Achievements</h2>
            <span className="text-xs bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300 px-2 py-1 rounded-full">
              {achievements?.length || 0} Total
            </span>
          </div>
          
          {achievements && achievements.length > 0 ? (
            <div className="space-y-3">
              {achievements.slice(0, 3).map((achievement: any) => (
                <motion.div 
                  key={achievement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center"
                >
                  <div className="bg-primary-100 dark:bg-primary-900 p-2 rounded-full mr-3">
                    <Award className="h-5 w-5 text-primary-600 dark:text-primary-300" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 dark:text-gray-100">{achievement.name}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{achievement.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="text-center p-6">
              <Award className="h-10 w-10 text-gray-400 dark:text-gray-600 mx-auto mb-3" />
              <h3 className="font-medium mb-1">No achievements yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">Start engaging to earn rewards</p>
            </Card>
          )}
        </div>
        
        {/* Топ пользователей */}
        <Leaderboard />
      </div>
    </AppLayout>
  );
}
