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
    eventStart: '',
    eventEnd: '',
    location: '',
    maxParticipants: 1,
    price: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('events')
      .insert({
        club_id: clubId,
        title: formData.title,
        description: formData.description,
        event_start: new Date(formData.eventStart).toISOString(),
        event_end: new Date(formData.eventEnd).toISOString(),
        location: formData.location,
        max_participants: formData.maxParticipants,
        price: formData.price,
        created_by: user.id
      });

    if (error) {
      console.error('Error creating event:', error);
      return;
    }

    setFormData({
      title: '',
      description: '',
      eventStart: '',
      eventEnd: '',
      location: '',
      maxParticipants: 1,
      price: 0,
    });

    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-black-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-black-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-black-700">
          Location
        </label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="eventStart" className="block text-sm font-medium text-black-700">
            Start Time
          </label>
          <input
            type="datetime-local"
            id="eventStart"
            value={formData.eventStart}
            onChange={(e) => setFormData({ ...formData, eventStart: e.target.value })}
            className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="eventEnd" className="block text-sm font-medium text-black-700">
            End Time
          </label>
          <input
            type="datetime-local"
            id="eventEnd"
            value={formData.eventEnd}
            onChange={(e) => setFormData({ ...formData, eventEnd: e.target.value })}
            className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="maxParticipants" className="block text-sm font-medium text-black-700">
            Maximum Participants
          </label>
          <input
            type="number"
            id="maxParticipants"
            min="1"
            value={formData.maxParticipants}
            onChange={(e) => setFormData({ ...formData, maxParticipants: parseInt(e.target.value) })}
            className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-black-700">
            Price ($)
          </label>
          <input
            type="number"
            id="price"
            min="0"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
      >
        Create Event
      </button>
    </form>
  );
};