import NavBar from "@/components/nav-bar";
import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  EventSummary,
  EventStatusEnum,
  SpringBootPagination,
} from "@/domain/domain";
import { deleteEvent, listEvents } from "@/lib/api";
import {
  AlertCircle,
  Calendar,
  Clock,
  Edit,
  MapPin,
  Tag,
  Trash,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router";

const DashboardListEventsPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const [events, setEvents] = useState<
    SpringBootPagination<EventSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [deleteEventError, setDeleteEventError] = useState<
    string | undefined
  >();

  const [page, setPage] = useState(0);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<
    EventSummary | undefined
  >();

  useEffect(() => {
    if (isLoading || !user?.access_token) {
      return;
    }
    refreshEvents(user.access_token);
  }, [isLoading, user, page]);

  const refreshEvents = async (accessToken: string) => {
    try {
      setEvents(await listEvents(accessToken, page));
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

  const formatDate = (date?: Date) => {
    if (!date) {
      return "TBD";
    }
    return new Date(date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date?: Date) => {
    if (!date) {
      return "";
    }
    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatStatusBadge = (status: EventStatusEnum) => {
    switch (status) {
      case EventStatusEnum.DRAFT:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
      case EventStatusEnum.PUBLISHED:
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
      case EventStatusEnum.CANCELLED:
        return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
      case EventStatusEnum.COMPLETED:
        return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
      default:
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200";
    }
  };

  const handleOpenDeleteEventDialog = (eventToDelete: EventSummary) => {
    setEventToDelete(undefined);
    setEventToDelete(eventToDelete);
    setDialogOpen(true);
  };

  const handleCancelDeleteEventDialog = () => {
    setEventToDelete(undefined);
    setEventToDelete(undefined);
    setDialogOpen(false);
  };

  const handleDeleteEvent = async () => {
    if (!eventToDelete || isLoading || !user?.access_token) {
      return;
    }

    try {
      setDeleteEventError(undefined);
      await deleteEvent(user.access_token, eventToDelete.id);
      setEventToDelete(undefined);
      setDialogOpen(false);
      refreshEvents(user.access_token);
    } catch (err) {
      if (err instanceof Error) {
        setDeleteEventError(err.message);
      } else if (typeof err === "string") {
        setDeleteEventError(err);
      } else {
        setDeleteEventError("An unknown error has occurred");
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

  return (
    <div className="min-h-screen bg-background text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <NavBar />

      <div className="mx-auto max-w-4xl px-4">
        {/* Title */}
        <div className="flex items-center justify-between gap-4 py-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Your Events</h1>
            <p className="text-slate-600 dark:text-slate-400">
              Events you have created
            </p>
          </div>
          <div>
            <Link to="/dashboard/events/create">
              <Button className="cursor-pointer">Create Event</Button>
            </Link>
          </div>
        </div>

        {/* Event Cards */}
        <div className="space-y-4">
          {events?.content.map((eventItem) => (
            <Card className="border-slate-200 bg-white text-slate-950 shadow-sm dark:border-slate-800 dark:bg-slate-900 dark:text-slate-50">
              <CardHeader>
                <div className="flex justify-between">
                  <h3 className="font-bold text-xl">{eventItem.name}</h3>
                  <span
                    className={`flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ${formatStatusBadge(eventItem.status)}`}
                  >
                    {eventItem.status}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Event Start & End */}
                <div className="flex space-x-2">
                  <Calendar className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-medium">
                      {formatDate(eventItem.start)} to{" "}
                      {formatDate(eventItem.end)}
                    </p>
                    <p className="text-slate-500 dark:text-slate-400">
                      {formatTime(eventItem.start)} -{" "}
                      {formatTime(eventItem.end)}
                    </p>
                  </div>
                </div>
                {/* Sales start and end */}
                <div className="flex space-x-2">
                  <Clock className="h-5 w-5 text-slate-400" />
                  <div>
                    <h4 className="font-medium">Sales Period</h4>
                    <p className="text-slate-500 dark:text-slate-400">
                      {formatDate(eventItem.salesStart)} to{" "}
                      {formatDate(eventItem.salesEnd)}
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <MapPin className="h-5 w-5 text-slate-400" />
                  <div>
                    <p className="font-medium">{eventItem.venue}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Tag className="h-5 w-5 text-slate-400" />
                  <div>
                    <h4 className="font-medium">Ticket Types</h4>
                    <ul>
                      {eventItem.ticketTypes.map((ticketType) => (
                        <li
                          key={ticketType.id}
                          className="flex gap-2 text-slate-500 dark:text-slate-400"
                        >
                          <span>{ticketType.name}</span>
                          <span>${ticketType.price}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                <Link to={`/dashboard/events/update/${eventItem.id}`}>
                  <Button
                    type="button"
                    variant="outline"
                    className="cursor-pointer"
                  >
                    <Edit />
                  </Button>
                </Link>
                <Button
                  type="button"
                  variant="destructive"
                  className="cursor-pointer"
                  onClick={() => handleOpenDeleteEventDialog(eventItem)}
                >
                  <Trash />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
      <div className="flex justify-center py-8">
        {events && (
          <SimplePagination pagination={events} onPageChange={setPage} />
        )}
      </div>
      <AlertDialog open={dialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete your event '{eventToDelete?.name}' and cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          {deleteEventError && (
            <Alert variant="destructive" className="border-red-700">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{deleteEventError}</AlertDescription>
            </Alert>
          )}
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDeleteEventDialog}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => handleDeleteEvent()}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DashboardListEventsPage;
