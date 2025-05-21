import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface CompletionItemProps {
  label: string;
  value: number;
  total?: number;
}

function CompletionItem({ label, value, total = 100 }: CompletionItemProps) {
  const percentage = Math.round((value / total) * 100);

  return (
    <div className="flex items-center">
      <div className="w-32 text-sm font-medium text-gray-700 dark:text-gray-300">{label}</div>
      <div className="flex-1">
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
          <div
            className="bg-primary-500 h-full rounded-full"
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
      <div className="ml-4 text-sm font-medium text-gray-900 dark:text-gray-100">{percentage}%</div>
    </div>
  );
}

export function CompletionChart() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/users/1/stats", "completion"],
    queryFn: () => fetch("/api/users/1/stats?period=weekly").then((res) => res.json()),
  });

  // Calculate engagement metrics
  const metrics = [
    { label: "Casts", key: "casts", value: 0 },
    { label: "Replies", key: "replies", value: 0 },
    { label: "Reactions", key: "reactions", value: 0 },
    { label: "Recasts", key: "recasts", value: 0 },
    { label: "Overall", key: "engagementRate", value: 0 },
  ];

  if (data && data.length > 0) {
    // Sum all metrics from data
    data.forEach((stat: any) => {
      metrics.forEach((metric) => {
        if (metric.key in stat) {
          metric.value += stat[metric.key];
        }
      });
    });

    // Calculate average for engagementRate
    metrics[4].value = Math.round(metrics[4].value / data.length);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Engagement Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <Skeleton key={index} className="h-6 w-full" />
            ))}
          </div>
        ) : error ? (
          <div className="py-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Failed to load engagement data. Please try again.
            </p>
          </div>
        ) : (
          metrics.map((metric) => (
            <CompletionItem
              key={metric.key}
              label={metric.label}
              value={metric.value}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
