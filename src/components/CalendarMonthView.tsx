"use client";

import { Event } from "@/types/event";

interface CalendarMonthViewProps {
  currentDate: Date;
  events: Event[];
  onEventClick: (event: Event) => void;
}

export const CalendarMonthView = ({ currentDate, events, onEventClick }: CalendarMonthViewProps) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDay = firstDay.getDay();

  const days = [];
  for (let i = 0; i < startingDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-24 border p-2"></div>);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const date = new Date(year, month, i);
    const dayEvents = events.filter(
      (event) =>
        new Date(event.event_date).toDateString() === date.toDateString()
    );

    days.push(
      <div
        key={i}
        className="h-24 border p-2 hover:bg-gray-50 cursor-pointer"
        onClick={() => {
          if (dayEvents.length > 0) {
            onEventClick(dayEvents[0]);
          }
        }}
      >
        <div className="font-bold">{i}</div>
        {dayEvents.map((event) => (
          <div
            key={event.id}
            className="text-sm bg-blue-100 rounded p-1 mb-1 truncate"
          >
            {event.title}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-7 gap-0">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="text-center font-bold p-2 border">
          {day}
        </div>
      ))}
      {days}
    </div>
  );
}; 