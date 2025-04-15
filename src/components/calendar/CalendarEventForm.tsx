"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Event } from "@/types/event";

interface CalendarEventFormProps {
  clubId: string;
  onEventCreated: (event: Event) => void;
}

export function CalendarEventForm({
  clubId,
  onEventCreated,
}: CalendarEventFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [maxPlayers, setMaxPlayers] = useState(4);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { data, error } = await supabase
      .from("events")
      .insert([
        {
          title,
          description,
          event_date: eventDate,
          max_players: maxPlayers,
          club_id: clubId,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating event:", error);
      setIsLoading(false);
      return;
    }

    onEventCreated(data);
    setTitle("");
    setDescription("");
    setEventDate("");
    setMaxPlayers(4);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows={3}
        />
      </div>

      <div>
        <label
          htmlFor="eventDate"
          className="block text-sm font-medium text-gray-700"
        >
          Date and Time
        </label>
        <input
          type="datetime-local"
          id="eventDate"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label
          htmlFor="maxPlayers"
          className="block text-sm font-medium text-gray-700"
        >
          Maximum Players
        </label>
        <input
          type="number"
          id="maxPlayers"
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(parseInt(e.target.value))}
          min="2"
          max="20"
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {isLoading ? "Creating..." : "Create Event"}
      </button>
    </form>
  );
} 