import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  TicketValidationMethod,
  TicketValidationStatus,
} from "@/domain/domain";
import { AlertCircle, Check, X } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { validateTicket } from "@/lib/api";
import { useAuth } from "react-oidc-context";
import NavBar from "@/components/nav-bar";

const DashboardValidateQrPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const [isManual, setIsManual] = useState(false);
  const [data, setData] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [validationStatus, setValidationStatus] = useState<
    TicketValidationStatus | undefined
  >();

  const handleReset = () => {
    setIsManual(false);
    setData(undefined);
    setError(undefined);
    setValidationStatus(undefined);
  };

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
    } else if (typeof err === "string") {
      setError(err);
    } else {
      setError("An unknown error occurred");
    }
  };

  const handleValidate = async (id: string, method: TicketValidationMethod) => {
    if (!user?.access_token) {
      return;
    }
    try {
      const response = await validateTicket(user.access_token, {
        id,
        method,
      });
      setValidationStatus(response.status);
    } catch (err) {
      handleError(err);
    }
  };

  if (isLoading || !user?.access_token) {
    return <p className="p-6 text-slate-600 dark:text-slate-300">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-background text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <NavBar />
      <div className="flex min-h-[calc(100vh-65px)] items-center justify-center p-4">
        <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          {error && (
            <div className="mb-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}
          {/* Scanner Viewport */}
          <div className="relative mx-auto mb-8 overflow-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-800 dark:bg-slate-950">
            <Scanner
              key={`scanner-${data}-${validationStatus}`}
              onScan={(result) => {
                if (result) {
                  const qrCodeId = result[0].rawValue;
                  setData(qrCodeId);
                  handleValidate(qrCodeId, TicketValidationMethod.QR_SCAN);
                }
              }}
              onError={handleError}
            />

            {validationStatus && (
              <div className="absolute inset-0 flex items-center justify-center">
                {validationStatus === TicketValidationStatus.VALID ? (
                  <div className="bg-green-500 rounded-full p-4">
                    <Check className="w-20 h-20" />
                  </div>
                ) : (
                  <div className="bg-red-500 rounded-full p-4">
                    <X className="w-20 h-20" />
                  </div>
                )}
              </div>
            )}
          </div>

          {isManual ? (
            <div className="pb-8">
              <Input
                className="mb-8 w-full bg-white text-lg text-slate-950 dark:bg-slate-950 dark:text-slate-50"
                onChange={(e) => setData(e.target.value)}
              />
              <Button
                className="h-14 w-full cursor-pointer"
                onClick={() =>
                  handleValidate(data || "", TicketValidationMethod.MANUAL)
                }
              >
                Submit
              </Button>
            </div>
          ) : (
            <div>
              <div className="flex min-h-12 items-center justify-center break-all rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-center font-mono text-sm text-slate-700 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300">
                <span>{data || "Scan for Result"}</span>
              </div>
              <Button
                variant="outline"
                className="my-6 h-14 w-full cursor-pointer text-base"
                onClick={() => setIsManual(true)}
              >
                Manual
              </Button>
            </div>
          )}

          <Button
            variant="secondary"
            className="h-14 w-full cursor-pointer text-base"
            onClick={handleReset}
          >
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DashboardValidateQrPage;
