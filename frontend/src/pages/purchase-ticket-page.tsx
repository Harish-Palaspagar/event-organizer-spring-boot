import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { purchaseTicket } from "@/lib/api";
import { CheckCircle, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router";
import NavBar from "@/components/nav-bar";

const PurchaseTicketPage: React.FC = () => {
  const { eventId, ticketTypeId } = useParams();
  const { isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();
  const [isPurchaseSuccess, setIsPurchaseASuccess] = useState(false);

  useEffect(() => {
    if (!isPurchaseSuccess) {
      return;
    }
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPurchaseSuccess]);

  const handlePurchase = async () => {
    if (isLoading || !user?.access_token || !eventId || !ticketTypeId) {
      return;
    }
    try {
      await purchaseTicket(user.access_token, eventId, ticketTypeId);
      setIsPurchaseASuccess(true);
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

  if (isPurchaseSuccess) {
    return (
      <div className="min-h-screen bg-background text-slate-950 dark:bg-slate-950 dark:text-slate-50">
        <NavBar />
        <div className="mx-auto flex min-h-[calc(100vh-65px)] max-w-md items-center p-8 text-center">
          <div className="rounded-lg border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="space-y-2">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
              <h2 className="text-2xl font-bold text-green-600">Thank you!</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Your ticket purchase was successful.
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Redirecting to home page in a few seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-slate-950 dark:bg-slate-950 dark:text-slate-50">
      <NavBar />
      <div className="mx-auto max-w-md px-4 py-12 md:py-20">
        <div className="space-y-5 rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Payment</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Complete your ticket purchase.
            </p>
          </div>
          {error && (
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <div className="text-red-500 text-sm">
                <strong>Error:</strong> {error}
              </div>
            </div>
          )}

          {/* Credit Card Number */}
          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-300">
              Credit Card Number
            </Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                className="bg-white pl-10 text-slate-950 dark:bg-slate-950 dark:text-slate-50"
              />
              <CreditCard className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-slate-700 dark:text-slate-300">
              Cardholder Name{" "}
            </Label>
            <div className="relative">
              <Input
                type="text"
                placeholder="John Smith"
                className="bg-white pl-10 text-slate-950 dark:bg-slate-950 dark:text-slate-50"
              />
              <CreditCard className="absolute top-2.5 left-3 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="flex justify-center">
            <Button className="w-full cursor-pointer" onClick={handlePurchase}>
              Purchase Ticket
            </Button>
          </div>

          <div className="flex items-center justify-center text-center text-xs text-slate-500 dark:text-slate-400">
            This is a mock page, no payment details should be entered.
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTicketPage;
