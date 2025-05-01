"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { EventView } from './EventView';
import { CalendarView } from './CalendarView';
import { Event } from '@/types/event';

type Club = {
  id: string;
  name: string;
  description: string;
  created_at: string;
};

interface EventListProps {
  clubId?: string;
  showOnlyUserEvents?: boolean;
}

export const EventList = ({ clubId, showOnlyUserEvents = false }: EventListProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [club, setClub] = useState<Club | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const fetchClub = async () => {
    if (!clubId) return;
    
    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .eq('id', clubId)
      .single();

    if (error) {
      console.error('Error fetching club:', error);
      return;
    }

    setClub(data);
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from("events")
          .select(`
            *,
            event_participants!inner (
              user_id
            )
          `)
          .order("event_start", { ascending: true });

        // If clubId is provided, filter by club
        if (clubId) {
          query = query.eq("club_id", clubId);
        }

        // If showOnlyUserEvents is true, get the current user's ID and filter
        if (showOnlyUserEvents) {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            query = query.eq('event_participants.user_id', user.id);
          }
        }

        const { data, error } = await query;

        if (error) throw error;
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

  useEffect(() => {
    fetchClub();
  }, [clubId]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (events.length === 0) return <div>No events found</div>;

  return (
    <div className="space-y-4">
      {club && (
        <div className="border p-4 rounded shadow mb-6">
          <h2 className="text-xl font-bold">{club.name}</h2>
          <p className="text-gray-600 mt-1">{club.description}</p>
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Upcoming Events</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setView('list')}
            className={`px-3 py-1 rounded-md ${
              view === 'list' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`px-3 py-1 rounded-md ${
              view === 'calendar' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'
            }`}
          >
            Calendar
          </button>
        </div>
      </div>

      {view === 'list' ? (
        <>
          {events.map((event) => (
            <EventView key={event.id} event={event} />
          ))}
        </>
      ) : (
        <CalendarView events={events} onEventClick={handleEventClick} />
      )}

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
};