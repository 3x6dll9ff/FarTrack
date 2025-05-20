import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { Link } from "wouter";
import { ChevronRight, Crown, Medal, Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "@shared/schema";

interface LeaderboardItemProps {
  user: User;
  rank: number;
  highlight?: boolean;
}

function LeaderboardItem({ user, rank, highlight }: LeaderboardItemProps) {
  // Badge colors based on rank
  const badges = [
    { icon: Trophy, bgColor: "bg-yellow-500", textColor: "text-yellow-500" },
    { icon: Medal, bgColor: "bg-gray-400", textColor: "text-gray-400" },
    { icon: Medal, bgColor: "bg-amber-600", textColor: "text-amber-600" },
  ];

  const BadgeIcon = rank <= 3 ? badges[rank - 1].icon : Crown;
  const badgeBg = rank <= 3 ? badges[rank - 1].bgColor : "bg-gray-500";

  return (
    <Link href={`/profile/${user.id}`}>
      <a className={cn(
        "flex items-center p-3 rounded-lg transition-colors",
        highlight ? "bg-primary-50 dark:bg-primary-900/30" : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
      )}>
        <div className="relative">
          <Avatar className={cn(
            "h-12 w-12 border-2",
            highlight ? "border-primary-200 dark:border-primary-800" : "border-gray-200 dark:border-gray-700"
          )}>
            <AvatarImage src={user.profileImage} alt={user.displayName || user.username} />
            <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div className={cn(
            "absolute -top-1 -right-1 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center",
            badgeBg
          )}>
            {rank}
          </div>
        </div>
        <div className="ml-3 flex-1">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.displayName || user.username}</h4>
          <p className="text-xs text-gray-500 dark:text-gray-400">@{user.username}</p>
        </div>
        <div className="text-right">
          <div className={cn(
            "text-sm font-semibold",
            highlight ? "text-primary-700 dark:text-primary-400" : "text-gray-700 dark:text-gray-300"
          )}>
            {user.totalPoints}
          </div>
          <div className={cn(
            "text-xs",
            highlight ? "text-primary-600 dark:text-primary-500" : "text-gray-500 dark:text-gray-400"
          )}>
            {user.followerCount} followers
          </div>
        </div>
      </a>
    </Link>
  );
}

export function Leaderboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/users/top"],
    queryFn: () => fetch("/api/users/top").then((res) => res.json()),
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-semibold">Top Performers</CardTitle>
        <Link href="/leaderboard">
          <a className="text-primary-600 text-sm font-medium hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 flex items-center">
            View All
            <ChevronRight className="h-4 w-4 ml-1" />
          </a>
        </Link>
      </CardHeader>
      <CardContent className="pt-2 space-y-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center p-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="ml-3 space-y-2 flex-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <div className="text-right space-y-2">
                  <Skeleton className="h-4 w-12 ml-auto" />
                  <Skeleton className="h-3 w-20 ml-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="py-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Failed to load leaderboard. Please try again.
            </p>
          </div>
        ) : (
          data?.map((user: User, index: number) => (
            <LeaderboardItem 
              key={user.id} 
              user={user} 
              rank={index + 1} 
              highlight={index === 0} 
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
