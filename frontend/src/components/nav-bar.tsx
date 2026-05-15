import { useAuth } from "react-oidc-context";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { useRoles } from "@/hooks/use-roles";
import { Link } from "react-router";
import ThemeToggle from "./theme-toggle";

const NavBar: React.FC = () => {
  const { user, signoutRedirect } = useAuth();
  const { isOrganizer } = useRoles();

  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 text-slate-900 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-6 md:gap-12">
            <Link to="/" className="text-lg font-bold tracking-tight">
              Event Ticket Platform
            </Link>
            <div className="flex gap-5 text-sm font-medium text-slate-600 dark:text-slate-300">
              <Link
                className="hover:text-slate-950 dark:hover:text-white"
                to="/dashboard"
              >
                Dashboard
              </Link>
              {isOrganizer && (
                <Link
                  className="hover:text-slate-950 dark:hover:text-white"
                  to="/dashboard/events"
                >
                  Events
                </Link>
              )}
              <Link
                className="hover:text-slate-950 dark:hover:text-white"
                to="/dashboard/tickets"
              >
                Tickets
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-slate-900 text-white text-xs">
                    {user?.profile?.preferred_username
                      ?.slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 border-slate-200 bg-white text-slate-900 shadow-lg dark:border-slate-800 dark:bg-slate-950 dark:text-slate-50"
                align="end"
              >
                <DropdownMenuLabel className="font-normal">
                  <p className="text-sm font-medium">
                    {user?.profile?.preferred_username}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {user?.profile?.email}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => signoutRedirect()}
                >
                  <LogOut />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
