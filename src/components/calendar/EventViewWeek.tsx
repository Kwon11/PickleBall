"use client";

import { Event } from "@/types/event";
import { format, startOfWeek, addDays, isSameDay } from "date-fns";

interface EventViewWeekProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

export function EventViewWeek({
  currentDate,
  events,
  onEventClick,
}: EventViewWeekProps) {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 0 });
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="grid grid-cols-7 border-b">
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className="p-4 text-center border-r last:border-r-0"
          >
            <div className="text-sm font-medium text-gray-500">
              {format(day, "EEE")}
            </div>
            <div
              className={`mt-1 text-lg font-semibold ${
                isSameDay(day, currentDate)
                  ? "text-blue-500"
                  : "text-gray-900"
              }`}
            >
              {format(day, "d")}
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 divide-x">
        {days.map((day) => {
          const dayEvents = events.filter((event) =>
            isSameDay(new Date(event.event_date), day)
          );

          return (
            <div
              key={day.toISOString()}
              className="min-h-[200px] p-2 space-y-2"
            >
              {dayEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-2 text-sm bg-blue-50 rounded cursor-pointer hover:bg-blue-100"
                  onClick={() => onEventClick(event)}
                >
                  <div className="font-medium truncate">{event.title}</div>
                  <div className="text-xs text-gray-500">
                    {format(new Date(event.event_date), "h:mm a")}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {event.event_participants?.length || 0} / {event.max_players}
                  </div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
} 