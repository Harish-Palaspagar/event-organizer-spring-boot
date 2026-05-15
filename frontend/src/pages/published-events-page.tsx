import RandomEventImage from "@/components/random-event-image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  PublishedEventDetails,
  PublishedEventTicketTypeDetails,
} from "@/domain/domain";
import { getPublishedEvent } from "@/lib/api";
import { AlertCircle, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link, useParams } from "react-router";
import PublicNavBar from "@/components/public-nav-bar";

const PublishedEventsPage: React.FC = () => {
  const { isLoading } = useAuth();
  const { id } = useParams();
  const [error, setError] = useState<string | undefined>();
  const [publishedEvent, setPublishedEvent] = useState<
    PublishedEventDetails | undefined
  >();
  const [selectedTicketType, setSelectedTicketType] = useState<
    PublishedEventTicketTypeDetails | undefined
  >();

  useEffect(() => {
    if (!id) {
      setError("ID must be provided!");
      return;
    }

    const doUseEffect = async () => {
      try {
        const eventData = await getPublishedEvent(id);
        setPublishedEvent(eventData);
        if (eventData.ticketTypes.length > 0) {
          setSelectedTicketType(eventData.ticketTypes[0]);
        }
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
    doUseEffect();
  }, [id]);

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

      <main className="container mx-auto px-4 py-10">
        {/* Header */}
        <div className="mx-auto mb-10 grid max-w-6xl items-center gap-8 lg:grid-cols-[1fr_420px]">
          {/* Left Column */}
          <div className="space-y-4">
            <div className="inline-flex rounded-md border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-600 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
              Event details
            </div>
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
              {publishedEvent?.name}
            </h1>
            <p className="flex gap-2 text-lg text-slate-600 dark:text-slate-300">
              <MapPin className="mt-1 h-5 w-5 shrink-0 text-slate-400" />
              {publishedEvent?.venue}
            </p>
          </div>
          {/* Right Column */}
          <div className="h-72 w-full overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <RandomEventImage />
          </div>
        </div>

        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6 text-2xl font-bold tracking-tight">
            Available Tickets
          </h2>
          <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
            {/* Left */}
            <div>
              {publishedEvent?.ticketTypes?.map((ticketType) => (
                <Card
                  className="mb-3 cursor-pointer gap-0 border-slate-200 bg-white text-slate-950 shadow-sm hover:border-primary/40 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50"
                  key={ticketType.id}
                  onClick={() => setSelectedTicketType(ticketType)}
                >
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        {ticketType.name}
                      </h3>
                      <span className="text-xl font-bold ">
                        ${ticketType.price}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-slate-600 dark:text-slate-300">
                      {ticketType.description}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Right */}
            <div className="text-slate-950 dark:text-slate-50">
              <div className="sticky top-24 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <h2 className="text-2xl font-bold">
                  {selectedTicketType?.name}
                </h2>
                <div className="mb-6">
                  <span className="text-3xl font-bold">
                    ${selectedTicketType?.price}
                  </span>
                </div>
                <div className="mb-6">
                  <p className="text-slate-600 dark:text-slate-300">
                    {selectedTicketType?.description}
                  </p>
                </div>
                <Link
                  to={`/events/${publishedEvent?.id}/purchase/${selectedTicketType?.id}`}
                >
                  <Button className="w-full cursor-pointer">
                    Purchase Ticket
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublishedEventsPage;
