import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { PageTitle } from "@/components/layout/page-title";
import { StatCard } from "@/components/dashboard/stat-card";
import { EngagementChart } from "@/components/dashboard/engagement-chart";
import { CompletionChart } from "@/components/dashboard/completion-chart";
import { Leaderboard } from "@/components/dashboard/leaderboard";
import { ProfileList } from "@/components/dashboard/profile-list";
import { AnalyticsGrid } from "@/components/dashboard/analytics-grid";
import { useQuery } from "@tanstack/react-query";
import { useMediaQuery } from "@/hooks/use-mobile";
import { useState } from "react";

export default function Dashboard() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: statsData } = useQuery({
    queryKey: ["/api/users/1/stats", "summary"],
    queryFn: () => fetch("/api/users/1/stats").then((res) => res.json()),
  });

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50 dark:bg-gray-900">
      <Sidebar className={sidebarOpen ? "translate-x-0" : isMobile ? "-translate-x-full" : "translate-x-0"} />
      
      <main className="flex-1 overflow-x-hidden">
        <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        
        <div className="px-4 sm:px-6 lg:px-8 py-6 space-y-6 transition-all duration-300">
          <PageTitle 
            title="Farcaster Analytics Dashboard" 
            description="Track your engagement and profile performance"
          />
          
          {/* Stat Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Points" 
              value="1,024" 
              change="+12% from last month" 
              changeType="positive"
              status="+12%"
              statusType="success"
              progressPercentage={85}
            />
            
            <StatCard 
              title="Engagement Rate" 
              value="78%" 
              change="+3% from last week" 
              changeType="positive"
              status="Above Average"
              statusType="info"
              progressPercentage={78}
            />
            
            <StatCard 
              title="Total Casts" 
              value="146" 
              change="+24 this month" 
              changeType="positive"
              status="On Track"
              statusType="success"
              progressPercentage={92}
            />
            
            <StatCard 
              title="Followers" 
              value="1,532" 
              change="+85 new followers" 
              changeType="positive"
              status="Growing"
              statusType="info"
              progressPercentage={65}
            />
          </div>
          
          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <EngagementChart />
            <CompletionChart />
          </div>
          
          {/* Recent Profiles */}
          <ProfileList />
          
          {/* Analytics and Leaderboard */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <AnalyticsGrid />
            <Leaderboard />
          </div>
        </div>
      </main>
    </div>
  );
}
