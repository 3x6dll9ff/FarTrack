import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Search, Bell, Menu, Filter } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/use-mobile";

interface HeaderProps {
  className?: string;
  onMenuClick?: () => void;
}

export function Header({ className, onMenuClick }: HeaderProps) {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchExpanded, setSearchExpanded] = useState(false);

  // Reset search expanded state when screen size changes
  useEffect(() => {
    setSearchExpanded(false);
  }, [isMobile]);

  return (
    <header
      className={cn(
        "bg-white border-b border-gray-200 sticky top-0 z-20 dark:bg-gray-900 dark:border-gray-800",
        className
      )}
    >
      <div className="px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            className="visible md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}

        <div className="flex items-center space-x-2 md:hidden">
          <div className="bg-primary-500 text-white p-1.5 rounded">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3-9-7.56c0-1.25.5-2.4 1-3.44 0 0-1.89-6.42-.5-7 1.39-.58 4.72.23 6.5 2.23A9.04 9.04 0 0 1 12 5Z"></path>
              <path d="M8 14v.5"></path>
              <path d="M16 14v.5"></path>
            </svg>
          </div>
          <h1 className="text-lg font-bold text-gray-800 dark:text-gray-200">
            FarTrack
          </h1>
        </div>

        <div className="flex items-center space-x-4 ml-auto">
          {isMobile ? (
            searchExpanded ? (
              <div className="absolute left-0 top-0 w-full p-2 bg-white dark:bg-gray-900 flex items-center z-30">
                <Input
                  type="text"
                  placeholder="Search profiles..."
                  className="w-full"
                  autoFocus
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSearchExpanded(false)}
                  className="ml-2"
                >
                  <span className="sr-only">Close search</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M18 6 6 18"></path>
                    <path d="m6 6 12 12"></path>
                  </svg>
                </Button>
              </div>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchExpanded(true)}
              >
                <Search className="h-5 w-5" />
              </Button>
            )
          ) : (
            <div className="relative">
              <Input
                type="text"
                placeholder="Search profiles..."
                className="py-1.5 pl-9 pr-4 w-40 md:w-64"
              />
              <Search className="text-gray-400 absolute left-3 top-2 h-4 w-4" />
            </div>
          )}

          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex items-center gap-2 text-sm"
          >
            <Filter className="h-4 w-4" />
            <span>Filter</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="relative"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-2 w-2 bg-primary-500 rounded-full" />
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
