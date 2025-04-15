"use client";

import { Event } from "@/types/event";
import { format, isSameDay } from "date-fns";

interface CalendarDayViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

export function CalendarDayView({
  currentDate,
  events,
  onEventClick,
}: CalendarDayViewProps) {
  const dayEvents = events.filter((event) =>
    isSameDay(new Date(event.event_date), currentDate)
  );

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">
          {format(currentDate, "EEEE, MMMM d, yyyy")}
        </h2>
      </div>
      <div className="p-4">
        {dayEvents.length === 0 ? (
          <p className="text-gray-500">No events scheduled for this day</p>
        ) : (
          <div className="space-y-4">
            {dayEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => onEventClick(event)}
              >
                <h3 className="font-medium">{event.title}</h3>
                <p className="text-sm text-gray-500">
                  {format(new Date(event.event_date), "h:mm a")}
                </p>
                <p className="text-sm text-gray-600 mt-2">{event.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  {event.event_participants?.length || 0} / {event.max_players} players
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 