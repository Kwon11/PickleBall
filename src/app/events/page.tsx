"use client";

import { EventList } from "@/components/EventList";

export default function EventsPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">My Events</h1>
      <EventList showOnlyUserEvents={true} />
    </div>
  );
} 