import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router";
import { useAuth } from "react-oidc-context";
import ThemeToggle from "./theme-toggle";

interface PublicNavBarProps {
  dashboardPath?: string;
  onLogin?: () => void;
}

const PublicNavBar: React.FC<PublicNavBarProps> = ({
  dashboardPath = "/dashboard",
  onLogin,
}) => {
  const { isAuthenticated, signinRedirect, signoutRedirect } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 text-slate-950 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 dark:text-slate-50">
      <div className="container mx-auto flex min-h-16 flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="text-base font-bold tracking-tight sm:text-lg">
          Event Ticket Platform
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => navigate(dashboardPath)}
              >
                Dashboard
              </Button>
              <Button
                className="cursor-pointer"
                onClick={() => signoutRedirect()}
              >
                Log out
              </Button>
            </>
          ) : (
            <Button
              className="cursor-pointer"
              onClick={onLogin || (() => signinRedirect())}
            >
              Log in
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default PublicNavBar;
