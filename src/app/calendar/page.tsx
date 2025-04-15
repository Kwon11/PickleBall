"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Event } from "@/types/event";
import { EventViewDay } from "@/components/calendar/EventViewDay";
import { EventViewWeek } from "@/components/calendar/EventViewWeek";
import { EventViewMonth } from "@/components/calendar/EventViewMonth";

export default function CalendarPage() {
  const [currentDate] = useState(new Date());
  const [events, setEvents] = useState<Event[]>([]);
  const [view, setView] = useState<"day" | "week" | "month">("week");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

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
    setSelectedEvent(event);
  };

  const handleCloseEvent = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Calendar</h1>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded ${
              view === "month"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setView("month")}
          >
            Month
          </button>
          <button
            className={`px-4 py-2 rounded ${
              view === "week"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setView("week")}
          >
            Week
          </button>
          <button
            className={`px-4 py-2 rounded ${
              view === "day"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
            onClick={() => setView("day")}
          >
            Day
          </button>
        </div>
      </div>

      {selectedEvent ? (
        <EventViewDay event={selectedEvent} onClose={handleCloseEvent} />
      ) : (
        <>
          {view === "month" && (
            <EventViewMonth
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
            />
          )}
          {view === "week" && (
            <EventViewWeek
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
            />
          )}
          {view === "day" && (
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-semibold mb-4">
                {currentDate.toLocaleDateString()}
              </h2>
              <div className="space-y-4">
                {events
                  .filter(
                    (event) =>
                      new Date(event.event_date).toDateString() ===
                      currentDate.toDateString()
                  )
                  .map((event) => (
                    <div
                      key={event.id}
                      className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleEventClick(event)}
                    >
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(event.event_date).toLocaleTimeString()}
                      </p>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
} 