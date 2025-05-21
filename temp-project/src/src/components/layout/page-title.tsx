import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ReactNode } from "react";
import { Download, Plus } from "lucide-react";

interface PageTitleProps {
  title: string;
  description?: string;
  className?: string;
  children?: ReactNode;
}

export function PageTitle({
  title,
  description,
  className,
  children,
}: PageTitleProps) {
  return (
    <div
      className={cn(
        "flex flex-col md:flex-row md:items-center md:justify-between",
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {title}
        </h1>
        {description && (
          <p className="text-gray-500 mt-1 dark:text-gray-400">{description}</p>
        )}
      </div>

      {children || (
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
          <Select defaultValue="30days">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="3months">Last 3 months</SelectItem>
                <SelectItem value="year">This year</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>

          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            <span>New Analysis</span>
          </Button>

          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            <span>Export</span>
          </Button>
        </div>
      )}
    </div>
  );
}
