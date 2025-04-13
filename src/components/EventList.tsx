"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { EventView } from './EventView';

type Event = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  max_players: number;
  created_by: string;
};

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
    fetchClub();
    fetchEvents();
  }, [clubId]);

  return (
    <div className="space-y-4">
      {club && (
        <div className="border p-4 rounded shadow mb-6">
          <h2 className="text-xl font-bold">{club.name}</h2>
          <p className="text-gray-600 mt-1">{club.description}</p>
        </div>
      )}
      
      <h3 className="text-lg font-semibold">Upcoming Events</h3>
      {events.map(event => (
        <EventView key={event.id} event={event} />
      ))}
      
      {events.length === 0 && (
        <p className="text-gray-500">No events scheduled yet.</p>
      )}
    </div>
  );
};