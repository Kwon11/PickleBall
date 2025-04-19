"use client";
import { useEffect, useState } from 'react';
import { getEvents } from '@/app/actions/events';
import { EventView } from './EventView';
import { CalendarView } from './CalendarView';
import { Event } from '@/types/event';

type EventListProps = {
  clubId: string;
  showOnlyUserEvents?: boolean;
};

export const EventList = ({ clubId, showOnlyUserEvents = false }: EventListProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getEvents(clubId, showOnlyUserEvents);
        setEvents(data || []);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError("Failed to load events");
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [clubId, showOnlyUserEvents]);

  if (loading) {
    return <div>Loading events...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (view === 'calendar') {
    return (
      <div>
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setView('list')}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Switch to List View
          </button>
        </div>
        <CalendarView events={events} onEventClick={setSelectedEvent} />
        {selectedEvent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
              <EventView event={selectedEvent} />
              <button
                onClick={() => setSelectedEvent(null)}
                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setView('calendar')}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Switch to Calendar View
        </button>
      </div>
      <div className="space-y-4">
        {events.map((event) => (
          <EventView key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};