import { useAuth } from "react-oidc-context";
import { Button } from "../components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { PublishedEventSummary, SpringBootPagination } from "@/domain/domain";
import { listPublishedEvents, searchPublishedEvents } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PublishedEventCard from "@/components/published-event-card";
import { SimplePagination } from "@/components/simple-pagination";
import PublicNavBar from "@/components/public-nav-bar";

const AttendeeLandingPage: React.FC = () => {
  const { isLoading } = useAuth();

  const [page, setPage] = useState(0);
  const [publishedEvents, setPublishedEvents] = useState<
    SpringBootPagination<PublishedEventSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [query, setQuery] = useState<string | undefined>();

  useEffect(() => {
    if (query && query.length > 0) {
      queryPublishedEvents();
    } else {
      refreshPublishedEvents();
    }
  }, [page]);

  const refreshPublishedEvents = async () => {
    try {
      setPublishedEvents(await listPublishedEvents(page));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error has occurred");
      }
    }
  };

  const queryPublishedEvents = async () => {
    if (!query) {
      await refreshPublishedEvents();
      return;
    }

    try {
      setPublishedEvents(await searchPublishedEvents(query, page));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error has occurred");
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-background p-6 dark:bg-slate-950">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return <p className="p-6 text-slate-600 dark:text-slate-300">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-background text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <PublicNavBar />
      {/* Hero */}
      <div className="container mx-auto mb-10 px-4 pt-6">
        <div className="overflow-hidden rounded-lg bg-[url(/organizers-landing-hero.png)] bg-cover bg-bottom shadow-sm">
          <div className="min-h-[280px] bg-slate-950/60 p-8 text-white md:p-14">
            <div className="mb-4 inline-flex rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide">
              Curated live experiences
            </div>
            <h1 className="mb-5 max-w-2xl text-3xl font-bold tracking-tight md:text-5xl">
              Find Tickets to Your Next Event
            </h1>
            <div className="flex max-w-2xl flex-col gap-2 rounded-lg bg-white p-2 shadow-lg sm:flex-row dark:bg-slate-950">
              <Input
                className="h-11 border-0 bg-white text-slate-950 shadow-none focus-visible:ring-0 dark:bg-slate-950 dark:text-slate-50"
                placeholder="Search by event name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button
                className="h-11 cursor-pointer"
                onClick={queryPublishedEvents}
              >
                <Search />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Published Event Cards */}
      <div className="container mx-auto px-4">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              Upcoming Events
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Browse published events and choose your ticket.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {publishedEvents?.content?.map((publishedEvent) => (
            <PublishedEventCard
              publishedEvent={publishedEvent}
              key={publishedEvent.id}
            />
          ))}
        </div>
      </div>

      {publishedEvents && (
        <div className="w-full flex justify-center py-8">
          <SimplePagination
            pagination={publishedEvents}
            onPageChange={setPage}
          />{" "}
        </div>
      )}
    </div>
  );
};

export default AttendeeLandingPage;
