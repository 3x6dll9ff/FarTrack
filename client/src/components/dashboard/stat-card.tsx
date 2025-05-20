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
        "bg-[#252525] rounded-xl shadow-sm border border-[#333333] p-5",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-gray-400 text-sm font-medium">
          {title}
        </h3>
        {status && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              statusType === "success" && "bg-green-900 text-green-300",
              statusType === "warning" && "bg-yellow-900 text-yellow-300",
              statusType === "danger" && "bg-red-900 text-red-300",
              statusType === "info" && "bg-purple-900 text-purple-300"
            )}
          >
            {status}
          </span>
        )}
        {icon && !status && <div className="text-purple-400">{icon}</div>}
      </div>
      
      <div className="mt-2 flex items-baseline">
        <h2 className="text-3xl font-bold text-white">{value}</h2>
        {change && (
          <span
            className={cn(
              "ml-2 text-xs font-medium",
              changeType === "positive" && "text-green-400",
              changeType === "negative" && "text-red-400",
              changeType === "neutral" && "text-gray-400"
            )}
          >
            {change}
          </span>
        )}
      </div>
      
      {typeof progressPercentage === "number" && (
        <div className="mt-3 w-full h-1.5 bg-[#333333] rounded-full overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full",
              statusType === "success" && "bg-green-500",
              statusType === "warning" && "bg-yellow-500",
              statusType === "danger" && "bg-red-500",
              statusType === "info" && "bg-purple-500",
              !statusType && "bg-purple-500"
            )}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}
    </div>
  );
}
