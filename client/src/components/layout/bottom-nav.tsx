import { cn } from "@/lib/utils";
import { Link, useLocation } from "wouter";
import { Home, Award, User } from "lucide-react";

export function BottomNav() {
  const [location] = useLocation();

  const NavItem = ({
    href,
    label,
    icon: Icon,
  }: {
    href: string;
    label: string;
    icon: React.ElementType;
  }) => {
    const isActive = 
      (href === "/" && location === "/") || 
      (href !== "/" && location.startsWith(href));
    
    return (
      <Link href={href}>
        <a
          className={cn(
            "flex flex-col items-center justify-center flex-1 py-3",
            isActive
              ? "text-primary-600 dark:text-primary-400"
              : "text-gray-500 dark:text-gray-400"
          )}
        >
          <Icon className={cn(
            "h-6 w-6 mb-1",
            isActive ? "text-primary-600 dark:text-primary-400" : "text-gray-500 dark:text-gray-400"
          )} />
          <span className="text-xs font-medium">{label}</span>
        </a>
      </Link>
    );
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 z-50 flex justify-around">
      <NavItem href="/" label="Home" icon={Home} />
      <NavItem href="/achievements" label="Earn" icon={Award} />
      <NavItem href="/profile/1" label="Profile" icon={User} />
    </div>
  );
}