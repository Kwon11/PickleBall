"use client";
import { useState } from 'react';
import { createEvent } from '@/app/actions/events';

type EventFormProps = {
  clubId: string;
  onSuccess?: () => void;
};

export const EventForm = ({ clubId, onSuccess }: EventFormProps) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventDate: '',
    eventEnd: '',
    location: '',
    maxPlayers: 1,
    skillLevel: 'all' as const,
    price: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createEvent(
        clubId,
        formData.title,
        formData.description,
        formData.eventDate,
        formData.eventEnd,
        formData.location,
        formData.maxPlayers,
        formData.skillLevel,
        formData.price
      );

      setFormData({
        title: '',
        description: '',
        eventDate: '',
        eventEnd: '',
        location: '',
        maxPlayers: 1,
        skillLevel: 'all',
        price: 0,
      });

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Error creating event:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
          Event Date
        </label>
        <input
          type="datetime-local"
          id="eventDate"
          value={formData.eventDate}
          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="eventEnd" className="block text-sm font-medium text-gray-700">
          Event End
        </label>
        <input
          type="datetime-local"
          id="eventEnd"
          value={formData.eventEnd}
          onChange={(e) => setFormData({ ...formData, eventEnd: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">
          Location
        </label>
        <input
          type="text"
          id="location"
          value={formData.location}
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="maxPlayers" className="block text-sm font-medium text-gray-700">
          Maximum Players
        </label>
        <input
          type="number"
          id="maxPlayers"
          value={formData.maxPlayers}
          onChange={(e) => setFormData({ ...formData, maxPlayers: parseInt(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="1"
          required
        />
      </div>

      <div>
        <label htmlFor="skillLevel" className="block text-sm font-medium text-gray-700">
          Skill Level
        </label>
        <select
          id="skillLevel"
          value={formData.skillLevel}
          onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value as 'all' })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Price
        </label>
        <input
          type="number"
          id="price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          min="0"
          step="0.01"
          required
        />
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