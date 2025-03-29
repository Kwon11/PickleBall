"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

type EventFormProps = {
  clubId: string;
  onSuccess?: () => void;
};

export const EventForm = ({ clubId, onSuccess }: EventFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    maxPlayers: 1,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('club_events')
      .insert({
        club_id: clubId,
        title: formData.title,
        description: formData.description,
        event_date: new Date(formData.eventDate).toISOString(),
        max_players: formData.maxPlayers,
        created_by: user.id
      });

    if (error) {
      console.error('Error creating event:', error);
      return;
    }

    setFormData({
      title: '',
      description: '',
      eventDate: '',
      maxPlayers: 1,
    });

    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Event Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Date and Time</label>
        <input
          type="datetime-local"
          value={formData.eventDate}
          onChange={e => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Max Players</label>
        <input
          type="number"
          min="1"
          value={formData.maxPlayers}
          onChange={e => setFormData(prev => ({ ...prev, maxPlayers: parseInt(e.target.value) }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Event
      </button>
    </form>
  );
};