"use client";

import { Event } from "@/types/event";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from "date-fns";

interface EventViewMonthProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

export function EventViewMonth({
  currentDate,
  events,
  onEventClick,
}: EventViewMonthProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get the first day of the month to calculate padding
  const firstDayOfMonth = monthStart.getDay();
  const paddingDays = Array(firstDayOfMonth).fill(null);

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-center">
          {format(currentDate, "MMMM yyyy")}
        </h2>
      </div>
      
      <div className="grid grid-cols-7 border-b">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7">
        {paddingDays.map((_, index) => (
          <div key={`padding-${index}`} className="min-h-[100px] p-2" />
        ))}
        
        {days.map((day) => {
          const dayEvents = events.filter((event) =>
            isSameDay(new Date(event.event_date), day)
          );

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[100px] p-2 border ${
                !isSameMonth(day, currentDate) ? "bg-gray-50" : ""
              }`}
            >
              <div
                className={`text-sm font-medium ${
                  isSameDay(day, currentDate)
                    ? "text-blue-500"
                    : "text-gray-900"
                }`}
              >
                {format(day, "d")}
              </div>
              <div className="mt-1 space-y-1">
                {dayEvents.map((event) => (
                  <div
                    key={event.id}
                    className="text-xs p-1 bg-blue-50 rounded cursor-pointer hover:bg-blue-100"
                    onClick={() => onEventClick(event)}
                  >
                    <div className="truncate">{event.title}</div>
                    <div className="text-gray-500">
                      {format(new Date(event.event_date), "h:mm a")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
} 