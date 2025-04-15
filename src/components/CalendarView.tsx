"use client";

import { useState } from "react";
import { CalendarView as CalendarViewType } from "@/types/calendar";
import { Event } from "@/types/event";

interface CalendarViewProps {
  events: Event[];
  onEventClick: (event: Event) => void;
}

export const CalendarView = ({ events, onEventClick }: CalendarViewProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<CalendarViewType>(CalendarViewType.MONTH);

  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === CalendarViewType.MONTH) {
      newDate.setMonth(newDate.getMonth() - 1);
    } else if (view === CalendarViewType.WEEK) {
      newDate.setDate(newDate.getDate() - 7);
    } else {
      newDate.setDate(newDate.getDate() - 1);
    }
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === CalendarViewType.MONTH) {
      newDate.setMonth(newDate.getMonth() + 1);
    } else if (view === CalendarViewType.WEEK) {
      newDate.setDate(newDate.getDate() + 7);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const formatDate = (date: Date) => {
    if (view === CalendarViewType.MONTH) {
      return date.toLocaleString("default", { month: "long", year: "numeric" });
    } else if (view === CalendarViewType.WEEK) {
      const start = new Date(date);
      start.setDate(start.getDate() - start.getDay());
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const renderCalendar = () => {
    if (view === CalendarViewType.MONTH) {
      return renderMonthView();
    } else if (view === CalendarViewType.WEEK) {
      return renderWeekView();
    } else {
      return renderDayView();
    }
  };

  const renderMonthView = () => {
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

  const renderWeekView = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay());
    const days = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      const dayEvents = events.filter(
        (event) =>
          new Date(event.event_date).toDateString() === date.toDateString()
      );

      days.push(
        <div key={i} className="flex-1 border p-2">
          <div className="font-bold">
            {date.toLocaleDateString("default", { weekday: "short" })}
          </div>
          <div className="text-sm">{date.getDate()}</div>
          {dayEvents.map((event) => (
            <div
              key={event.id}
              className="text-sm bg-blue-100 rounded p-1 mb-1 truncate cursor-pointer"
              onClick={() => onEventClick(event)}
            >
              {event.title}
            </div>
          ))}
        </div>
      );
    }

    return <div className="flex">{days}</div>;
  };

  const renderDayView = () => {
    const dayEvents = events.filter(
      (event) =>
        new Date(event.event_date).toDateString() ===
        currentDate.toDateString()
    );

    return (
      <div className="border p-4">
        <div className="font-bold mb-4">
          {currentDate.toLocaleDateString("default", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </div>
        {dayEvents.map((event) => (
          <div
            key={event.id}
            className="bg-blue-100 rounded p-2 mb-2 cursor-pointer"
            onClick={() => onEventClick(event)}
          >
            <div className="font-bold">{event.title}</div>
            <div className="text-sm">
              {new Date(event.event_date).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={handlePrev}
            className="px-3 py-1 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600"
          >
            Prev
          </button>
          <button
            onClick={handleToday}
            className="px-3 py-1 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600"
          >
            Today
          </button>
          <button
            onClick={handleNext}
            className="px-3 py-1 bg-slate-700 text-slate-300 rounded-md hover:bg-slate-600"
          >
            Next
          </button>
        </div>
        <div className="text-xl font-bold">{formatDate(currentDate)}</div>
        <div className="flex space-x-2">
          <button
            onClick={() => setView(CalendarViewType.MONTH)}
            className={`px-3 py-1 rounded-md ${
              view === CalendarViewType.MONTH
                ? "bg-blue-500 text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView(CalendarViewType.WEEK)}
            className={`px-3 py-1 rounded-md ${
              view === CalendarViewType.WEEK
                ? "bg-blue-500 text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setView(CalendarViewType.DAY)}
            className={`px-3 py-1 rounded-md ${
              view === CalendarViewType.DAY
                ? "bg-blue-500 text-white"
                : "bg-slate-700 text-slate-300"
            }`}
          >
            Day
          </button>
        </div>
      </div>
      {renderCalendar()}
    </div>
  );
}; 