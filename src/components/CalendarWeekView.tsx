"use client";

import { Event } from "@/types/event";

interface CalendarWeekViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

export const CalendarWeekView = ({ currentDate, events, onEventClick }: CalendarWeekViewProps) => {
  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
  
  const days = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    
    const dayEvents = events.filter(
      (event) =>
        new Date(event.event_date).toDateString() === date.toDateString()
    );

    days.push(
      <div key={i} className="flex-1 border p-2">
        <div className="font-bold mb-2">
          {date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </div>
        <div className="space-y-1">
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className="text-sm bg-blue-100 rounded p-1 cursor-pointer hover:bg-blue-200"
              onClick={() => onEventClick(event)}
            >
              {event.title}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      {days}
    </div>
  );
}; 