import { PublishedEventSummary } from "@/domain/domain";
import { Card } from "./ui/card";
import { Calendar, Heart, MapPin, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router";
import RandomEventImage from "./random-event-image";

interface PublishedEventCardProperties {
  publishedEvent: PublishedEventSummary;
}

const PublishedEventCard: React.FC<PublishedEventCardProperties> = ({
  publishedEvent,
}) => {
  return (
    <Link to={`/events/${publishedEvent.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden gap-0 border-slate-200 bg-white py-0 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">
        {/* Card Image */}
        <div className="h-[150px] overflow-hidden bg-slate-100 dark:bg-slate-800">
          <RandomEventImage />
        </div>
        <div className="space-y-3 p-4">
          <h3 className="line-clamp-2 text-base font-semibold text-slate-950 group-hover:text-primary dark:text-slate-50">
            {publishedEvent.name}
          </h3>
          <div className="space-y-2">
            <div className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <span className="line-clamp-1">{publishedEvent.venue}</span>
            </div>
            <div className="flex gap-2 text-sm text-slate-600 dark:text-slate-300">
              {publishedEvent.start && publishedEvent.end ? (
                <div className="flex gap-2">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />{" "}
                  <span>
                    {format(publishedEvent.start, "PP")} -{" "}
                    {format(publishedEvent.end, "PP")}
                  </span>
                </div>
              ) : (
                <div className="flex gap-2">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
                  Dates TBD
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-auto flex justify-between border-t border-slate-100 px-4 py-3 text-slate-500 dark:border-slate-800 dark:text-slate-400">
          <button className="cursor-pointer rounded-md p-1 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white">
            <Heart className="h-4 w-4" />
          </button>
          <button className="cursor-pointer rounded-md p-1 hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </Card>
    </Link>
  );
};

export default PublishedEventCard;
