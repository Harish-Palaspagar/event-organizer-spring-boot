import { Button } from "@/components/ui/button";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import PublicNavBar from "@/components/public-nav-bar";

const OrganizersLandingPage: React.FC = () => {
  const { isLoading, signinRedirect } = useAuth();

  const navigate = useNavigate();

  const loginAsOrganizer = () => {
    localStorage.setItem("redirectPath", "/dashboard/events/create");
    signinRedirect({ state: { redirectPath: "/dashboard/events/create" } });
  };

  if (isLoading) {
    return <p className="p-6 text-slate-600 dark:text-slate-300">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-background text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <PublicNavBar
        dashboardPath="/dashboard/events"
        onLogin={loginAsOrganizer}
      />

      <main className="container mx-auto px-4 py-12">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_440px]">
          {/* Left Column */}
          <div className="space-y-6">
            <div className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              For organizers
            </div>
            <h1 className="max-w-3xl text-4xl font-bold tracking-tight md:text-6xl">
              Create, Manage, and Sell Events Tickets with Ease
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              A complete platform for event organizers to create events, sell
              tickets, and validate attendees with QR Codes.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="cursor-pointer"
                onClick={() => navigate("/dashboard/events/create")}
              >
                Create an Event
              </Button>
              <Button size="lg" variant="outline">
                Browse Events
              </Button>
            </div>
          </div>
          {/* Right Column */}
          <div className="aspect-[4/5] w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <img
              src="organizers-landing-hero.png"
              alt="A busy concert"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrganizersLandingPage;
