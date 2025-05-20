import { AppLayout } from "@/components/layout/app-layout";
import { StatCard } from "@/components/dashboard/stat-card";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, BarChart2, Heart, Award, ArrowUp, Repeat } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
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

  // Получение статистики за последние сутки
  const latestStat = statsData && statsData.length > 0 ? statsData[0] : null;
  const dailyReactions = latestStat?.reactions || 0;
  const dailyRecasts = latestStat?.recasts || 0;

  return (
    <AppLayout title="FarTrack">
      <div className="p-4 space-y-5">
        {/* Приветствие и профиль */}
        <div className="flex items-center">
          <Avatar className="h-12 w-12 border-2 border-purple-100">
            <AvatarImage src={userData?.profileImage} alt={userData?.displayName || 'User'} />
            <AvatarFallback>{userData?.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className="ml-3">
            <h2 className="text-lg font-bold">Hey, {userData?.displayName || 'User'}!</h2>
            <p className="text-sm text-gray-600">Track your Farcaster engagement</p>
          </div>
        </div>
        
        {/* Счетчики */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard 
            title="Points" 
            value={userData?.totalPoints || 0}
            status="+12%"
            statusType="success"
            icon={<BarChart2 className="h-4 w-4 text-purple-600" />}
            progressPercentage={72}
          />
          
          <StatCard 
            title="Reactions" 
            value={dailyReactions}
            status="Today"
            statusType="info"
            icon={<Heart className="h-4 w-4 text-red-500" />}
          />
          
          <StatCard 
            title="Recasts" 
            value={dailyRecasts}
            status="Today"
            statusType="info"
            icon={<Repeat className="h-4 w-4 text-green-500" />}
          />
        </div>
        
        {/* Баннер */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center mb-2">
            <div className="p-1.5 bg-white/20 rounded-lg mr-2">
              <Award className="h-5 w-5" />
            </div>
            <h2 className="text-base font-bold">Daily Progress</h2>
          </div>
          <div className="bg-white/10 rounded-lg p-2.5 mb-1">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-medium">Points Progress</span>
              <span className="text-xs font-medium">72/100</span>
            </div>
            <Progress value={72} className="h-1.5 bg-white/20" />
          </div>
          <p className="text-xs text-white/80">Complete activities to earn more points!</p>
        </div>
        
        {/* Активность */}
        <Card className="border border-gray-100">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium">Points Activity</CardTitle>
          </CardHeader>
          <CardContent className="pt-2">
            <div className="h-36">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorPoints" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#7c3aed" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="points" 
                    stroke="#7c3aed" 
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
            <h2 className="text-base font-bold">Your Achievements</h2>
            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
              {achievements?.length || 0} Total
            </span>
          </div>
          
          {achievements && achievements.length > 0 ? (
            <div className="space-y-3">
              {achievements.slice(0, 2).map((achievement: any) => (
                <motion.div 
                  key={achievement.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-3 rounded-lg border border-gray-100 flex items-center"
                >
                  <div className="bg-purple-100 p-2 rounded-full mr-3">
                    <Award className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 text-sm">{achievement.name}</h3>
                    <p className="text-xs text-gray-500">{achievement.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <Card className="text-center p-6 border border-gray-100">
              <Award className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <h3 className="font-medium mb-1">No achievements yet</h3>
              <p className="text-sm text-gray-500">Start engaging to earn rewards</p>
            </Card>
          )}
        </div>
        
        {/* Топ пользователей */}
        <Leaderboard />
      </div>
    </AppLayout>
  );
}
