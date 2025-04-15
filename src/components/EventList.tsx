"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { EventView } from './EventView';
import { CalendarView } from './CalendarView';
import { Event } from '@/types/event';

type Club = {
  id: string;
  name: string;
  description: string;
  created_at: string;
};

type EventListProps = {
  clubId: string;
};

export const EventList = ({ clubId }: EventListProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [club, setClub] = useState<Club | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const fetchClub = async () => {
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

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('club_events')
      .select(`
        *,
        participants:event_participants(
          id,
          is_waitlisted,
          profiles:profiles(
            full_name
          )
        )
      `)
      .eq('club_id', clubId)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return;
    }

    setEvents(data || []);
  };

  useEffect(() => {
    fetchClub();
    fetchEvents();
  }, [clubId]);

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
  };

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
          {events.map(event => (
            <EventView key={event.id} event={event} />
          ))}
          {events.length === 0 && (
            <p className="text-gray-500">No events scheduled yet.</p>
          )}
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