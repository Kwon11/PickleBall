"use client";

import { Event } from "@/types/event";

interface CalendarDayViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

export const CalendarDayView = ({ currentDate, events, onEventClick }: CalendarDayViewProps) => {
  const dayEvents = events.filter(
    (event) =>
      new Date(event.event_date).toDateString() === currentDate.toDateString()
  );

  return (
    <div className="p-4">
      <div className="font-bold text-xl mb-4">
        {currentDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </div>
      <div className="space-y-2">
        {dayEvents.map((event) => (
          <div
            key={event.id}
            className="p-3 bg-blue-100 rounded-lg cursor-pointer hover:bg-blue-200"
            onClick={() => onEventClick(event)}
          >
            <div className="font-semibold">{event.title}</div>
            <div className="text-sm text-gray-600">
              {new Date(event.event_date).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit'
              })}
            </div>
            <div className="text-sm mt-1">{event.description}</div>
          </div>
        ))}
        {dayEvents.length === 0 && (
          <div className="text-gray-500 text-center py-4">
            No events scheduled for this day
          </div>
        )}
      </div>
    </div>
  );
}; 