"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const EventForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    maxPlayers: 1,
    isPublic: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: event, error } = await supabase
      .from('events')
      .insert([{
        title: formData.title,
        description: formData.description,
        event_date: new Date(formData.eventDate).toISOString(),
        max_players: formData.maxPlayers,
        is_public: formData.isPublic,
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating event:', error);
      return;
    }

    if (onSuccess) onSuccess();
    setFormData({
      title: '',
      description: '',
      eventDate: '',
      maxPlayers: 1,
      isPublic: true
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Date and Time</label>
        <input
          type="datetime-local"
          value={formData.eventDate}
          onChange={e => setFormData(prev => ({ ...prev, eventDate: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
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
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isPublic}
            onChange={e => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
            className="rounded border-gray-300"
          />
          <span className="ml-2">Public Event</span>
        </label>
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