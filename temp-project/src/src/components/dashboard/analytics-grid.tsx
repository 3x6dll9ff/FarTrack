import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { Link } from "wouter";
import { LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

export function AnalyticsGrid() {
  const { data: statsData, isLoading: statsLoading, error: statsError } = useQuery({
    queryKey: ["/api/users/1/stats"],
    queryFn: () => fetch("/api/users/1/stats").then((res) => res.json()),
  });

  // Mock data for charts
  const engagementData = statsData ? statsData.slice(0, 7).map((stat: any) => ({
    name: new Date(stat.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    engagement: stat.casts + stat.replies + stat.reactions + stat.recasts,
    rate: stat.engagementRate
  })) : [];

  const pieData = [
    { name: "Casts", value: 45, color: "#6366f1" },
    { name: "Replies", value: 30, color: "#22c55e" },
    { name: "Reactions", value: 15, color: "#f59e0b" },
    { name: "Recasts", value: 10, color: "#0ea5e9" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Engagement Trends */}
      <Card className="col-span-1 lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-lg font-semibold">Engagement Trends</CardTitle>
          <Link href="/analytics">
            <a className="text-primary-600 text-sm font-medium hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center">
              Details
              <ChevronRight className="h-4 w-4 ml-1" />
            </a>
          </Link>
        </CardHeader>
        <CardContent className="pt-4">
          {statsLoading ? (
            <Skeleton className="h-[200px] w-full" />
          ) : statsError ? (
            <div className="h-[200px] flex items-center justify-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">Failed to load data</p>
            </div>
          ) : (
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={engagementData}>
                  <defs>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="engagement" 
                    stroke="#6366f1" 
                    fillOpacity={1} 
                    fill="url(#colorEngagement)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Engagement by Type</h4>
              {statsLoading ? (
                <Skeleton className="h-[150px] w-full" />
              ) : (
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={60}
                        dataKey="value"
                        label={({ name }) => name}
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
              <h4 className="text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">Engagement Rate</h4>
              {statsLoading ? (
                <Skeleton className="h-[150px] w-full" />
              ) : (
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={engagementData}>
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="rate" 
                        stroke="#22c55e" 
                        strokeWidth={2}
                        dot={{ r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Export Data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-800 mb-2 dark:text-gray-200">
              Profile Reports
            </h3>
            <p className="text-xs text-gray-500 mb-3 dark:text-gray-400">
              Export your profile data and activity metrics to share with your team
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" className="w-full text-sm h-8" size="sm">
                CSV
              </Button>
              <Button variant="outline" className="w-full text-sm h-8" size="sm">
                PDF
              </Button>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-800 mb-2 dark:text-gray-200">
              Engagement Analytics
            </h3>
            <p className="text-xs text-gray-500 mb-3 dark:text-gray-400">
              Download detailed analytics about your engagement performance
            </p>
            <div className="flex space-x-2">
              <Button variant="outline" className="w-full text-sm h-8" size="sm">
                CSV
              </Button>
              <Button variant="outline" className="w-full text-sm h-8" size="sm">
                PDF
              </Button>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-800 mb-2 dark:text-gray-200">
              Schedule Reports
            </h3>
            <p className="text-xs text-gray-500 mb-3 dark:text-gray-400">
              Automatically receive reports on a schedule
            </p>
            <Button className="w-full text-sm h-8" size="sm">
              Configure
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
