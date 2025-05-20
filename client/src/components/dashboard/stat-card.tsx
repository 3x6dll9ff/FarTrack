import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  status?: string;
  statusType?: "success" | "warning" | "danger" | "info";
  progressPercentage?: number;
  icon?: ReactNode;
  className?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeType = "positive",
  status,
  statusType = "info",
  progressPercentage,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl shadow-sm border border-gray-200 p-5 dark:bg-gray-800 dark:border-gray-700",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-gray-500 text-sm font-medium dark:text-gray-400">
          {title}
        </h3>
        {status && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              statusType === "success" &&
                "bg-success-100 text-success-700 dark:bg-success-900 dark:text-success-300",
              statusType === "warning" &&
                "bg-warning-100 text-warning-700 dark:bg-warning-900 dark:text-warning-300",
              statusType === "danger" &&
                "bg-danger-100 text-danger-700 dark:bg-danger-900 dark:text-danger-300",
              statusType === "info" &&
                "bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-300"
            )}
          >
            {status}
          </span>
        )}
        {icon && !status && <div className="text-primary-500">{icon}</div>}
      </div>
      
      <div className="mt-2 flex items-baseline">
        <h2 className="text-3xl font-bold dark:text-white">{value}</h2>
        {change && (
          <span
            className={cn(
              "ml-2 text-xs font-medium",
              changeType === "positive" && "text-success-500 dark:text-success-400",
              changeType === "negative" && "text-danger-500 dark:text-danger-400",
              changeType === "neutral" && "text-gray-500 dark:text-gray-400"
            )}
          >
            {change}
          </span>
        )}
      </div>
      
      {typeof progressPercentage === "number" && (
        <div className="mt-3 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden dark:bg-gray-700">
          <div
            className={cn(
              "h-full rounded-full",
              statusType === "success" && "bg-success-500",
              statusType === "warning" && "bg-warning-500",
              statusType === "danger" && "bg-danger-500",
              statusType === "info" && "bg-primary-500",
              !statusType && "bg-primary-500"
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
