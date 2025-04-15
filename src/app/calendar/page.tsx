"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Event } from "@/types/event";
import { CalendarWeekView } from "@/components/calendar/CalendarWeekView";
import { CalendarDayView } from "@/components/calendar/CalendarDayView";

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<"week" | "day">("week");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: true });

    if (error) {
      console.error("Error fetching events:", error);
      return;
    }

    setEvents(data || []);
  };

  const handleEventClick = (event: Event) => {
    setCurrentDate(new Date(event.event_date));
    setView("day");
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded ${
              view === "week"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setView("week")}
          >
            Week View
          </button>
          <button
            className={`px-4 py-2 rounded ${
              view === "day"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setView("day")}
          >
            Day View
          </button>
        </div>
      </div>

      {view === "week" ? (
        <CalendarWeekView
          currentDate={currentDate}
          events={events}
          onEventClick={handleEventClick}
        />
      ) : (
        <CalendarDayView
          currentDate={currentDate}
          events={events}
          onEventClick={handleEventClick}
        />
      )}
    </div>
  );
} 