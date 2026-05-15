import { TicketDetails, TicketStatus } from "@/domain/domain";
import { getTicket, getTicketQr } from "@/lib/api";
import { format } from "date-fns";
import { Calendar, DollarSign, MapPin, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useParams } from "react-router";
import NavBar from "@/components/nav-bar";

const DashboardViewTicketPage: React.FC = () => {
  const [ticket, setTicket] = useState<TicketDetails | undefined>();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | undefined>();
  const [isQrLoading, setIsQrCodeLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const { id } = useParams();
  const { isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading || !user?.access_token || !id) {
      return;
    }

    const doUseEffect = async (accessToken: string, id: string) => {
      try {
        setIsQrCodeLoading(true);
        setError(undefined);

        setTicket(await getTicket(accessToken, id));
        setQrCodeUrl(URL.createObjectURL(await getTicketQr(accessToken, id)));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("An unknown error has occurred");
        }
      } finally {
        setIsQrCodeLoading(false);
      }
    };

    doUseEffect(user?.access_token, id);

    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, [user?.access_token, isLoading, id]);

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.PURCHASED:
        return "text-green-400";
      case TicketStatus.CANCELLED:
        return "text-red-400";
      default:
        return "text-slate-400";
    }
  };

  if (!ticket) {
    return <p className="p-6 text-slate-600 dark:text-slate-300">Loading..</p>;
  }

  return (
    <div className="min-h-screen bg-background text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <NavBar />
      <div className="flex min-h-[calc(100vh-65px)] items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="relative rounded-lg border border-slate-200 bg-white p-6 shadow-lg dark:border-slate-800 dark:bg-slate-900 sm:p-8">
            {/* Status */}
            <div className="mb-8 rounded-md bg-slate-100 px-3 py-1 text-center dark:bg-slate-800">
              <span
                className={`text-sm font-medium ${getStatusColor(ticket.status)}`}
              >
                {ticket?.status}
              </span>
            </div>

            <div className="mb-2">
              <h1 className="text-2xl font-bold mb-2">{ticket.eventName}</h1>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                <MapPin className="w-4 text-slate-400" />
                <span>{ticket.eventVenue}</span>
              </div>
            </div>

            <div className="mb-8 flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Calendar className="w-4 text-slate-400" />
              <div>
                {format(ticket.eventStart, "Pp")} -{" "}
                {format(ticket.eventEnd, "Pp")}
              </div>
            </div>

            <div className="flex justify-center mb-8">
              <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700">
                <div className="w-32 h-32 flex items-center justify-center">
                  {/* Loading */}
                  {isQrLoading && (
                    <div className="text-xs text-center p2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 mb-2 mx-auto"></div>
                      <div className="text-slate-800">Loading QR...</div>
                    </div>
                  )}
                  {/* error */}
                  {error && (
                    <div className="text-red-400 text-sm text-center p-2">
                      <div className="mb-1">⚠️</div>
                      {error}
                    </div>
                  )}
                  {/* Display QR */}
                  {qrCodeUrl && !isQrLoading && !error && (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code for event"
                      className="w-full h-full object-contain rounded-large"
                    />
                  )}
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Present this QR code at the venue for entry
              </p>
            </div>

            <div className="space-y-2 mb-8">
              <div className="flex items-center gap-2">
                <Tag className="w-5 text-slate-400" />
                <span className="font-semibold">{ticket.description}</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 text-slate-400" />
                <span className="font-semibold">{ticket.price}</span>
              </div>
            </div>

            <div className="text-center mb-2">
              <h4 className="text-sm font-semibold font-mono">Ticket ID</h4>
              <p className="break-all text-sm font-mono text-slate-500 dark:text-slate-400">
                {ticket.id}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardViewTicketPage;
