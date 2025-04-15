"use client";

import { Event } from "@/types/event";
import { format } from "date-fns";

interface EventViewDayProps {
  event: Event;
  onClose: () => void;
}

export function EventViewDay({ event, onClose }: EventViewDayProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-start mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{event.title}</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Date & Time</h3>
          <p className="mt-1 text-lg text-gray-900">
            {format(new Date(event.event_date), "EEEE, MMMM d, yyyy 'at' h:mm a")}
          </p>
        </div>

        {event.description && (
          <div>
            <h3 className="text-sm font-medium text-gray-500">Description</h3>
            <p className="mt-1 text-gray-900">{event.description}</p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-medium text-gray-500">Players</h3>
          <p className="mt-1 text-gray-900">
            {event.event_participants?.length || 0} / {event.max_players} spots filled
          </p>
        </div>

        <div className="pt-4">
          <button
            onClick={onClose}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 