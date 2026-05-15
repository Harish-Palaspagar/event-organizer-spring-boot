import NavBar from "@/components/nav-bar";
import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SpringBootPagination, TicketSummary } from "@/domain/domain";
import { listTickets } from "@/lib/api";
import { AlertCircle, DollarSign, Tag, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router";

const DashboardListTickets: React.FC = () => {
  const { isLoading, user } = useAuth();

  const [tickets, setTickets] = useState<
    SpringBootPagination<TicketSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (isLoading || !user?.access_token) {
      return;
    }

    const doUseEffect = async () => {
      try {
        setTickets(await listTickets(user.access_token, page));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    doUseEffect();
  }, [isLoading, user?.access_token, page]);

  if (error) {
    return (
      <div className="min-h-screen bg-background text-slate-950 dark:bg-slate-950 dark:text-slate-50">
        <NavBar />
        <Alert variant="destructive" className="m-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <NavBar />

      {/* Title */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold tracking-tight">Your Tickets</h1>
        <p className="text-slate-600 dark:text-slate-400">
          Tickets you have purchased
        </p>
      </div>

      <div className="mx-auto max-w-4xl space-y-4 px-4">
        {tickets?.content.map((ticketItem) => (
          <Link to={`/dashboard/tickets/${ticketItem.id}`}>
            <Card
              key={ticketItem.id}
              className="border-slate-200 bg-white text-slate-950 shadow-sm hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50"
            >
              <CardHeader>
                <div className="flex justify-between">
                  <div className="flex items-center gap-2">
                    <Ticket className="h-5 w-5 text-slate-400" />
                    <h3 className="font-bold text-xl">
                      {ticketItem.ticketType.name}
                    </h3>
                  </div>
                  <span className="rounded-md bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    {ticketItem.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Price */}
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-slate-400" />
                  <p className="font-medium">${ticketItem.ticketType.price}</p>
                </div>

                {/* Ticket ID */}
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-slate-400" />
                  <div>
                    <h4 className="font-medium">Ticket ID</h4>
                    <p className="text-sm font-mono text-slate-500 dark:text-slate-400">
                      {ticketItem.id}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="flex justify-center py-8">
        {tickets && (
          <SimplePagination pagination={tickets} onPageChange={setPage} />
        )}
      </div>
    </div>
  );
};

export default DashboardListTickets;
