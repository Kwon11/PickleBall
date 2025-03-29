"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Event = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  max_players: number;
  created_by: string;
};

type EventListProps = {
  clubId: string;
};

export const EventList = ({ clubId }: EventListProps) => {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    const { data, error } = await supabase
      .from('club_events')
      .select('*')
      .eq('club_id', clubId)
      .order('event_date', { ascending: true });

    if (error) {
      console.error('Error fetching events:', error);
      return;
    }

    setEvents(data || []);
  };

  useEffect(() => {
    fetchEvents();
  }, [clubId]);

  return (
    <div className="space-y-4">
      {events.map(event => (
        <div key={event.id} className="border p-4 rounded shadow">
          <h3 className="text-lg font-bold">{event.title}</h3>
          <p className="text-gray-600 mt-1">{event.description}</p>
          <div className="mt-2 text-sm">
            <p>Date: {new Date(event.event_date).toLocaleString()}</p>
            <p>Max Players: {event.max_players}</p>
          </div>
        </div>
      ))}
      
      {events.length === 0 && (
        <p className="text-gray-500">No events scheduled yet.</p>
      )}
    </div>
  );
};