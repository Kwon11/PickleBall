"use client";
import { useState } from "react";
import { EventList } from '@/components/EventList'
import { EventForm } from '@/components/EventForm'
import { ClubSelector } from '@/components/ClubSelector'

const Home = () => {
  const [selectedClubId, setSelectedClubId] = useState<string>('');

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex justify-between">
          <h2 className="text-2xl font-bold text-primary mb-4">Events</h2>
          <ClubSelector onClubSelect={setSelectedClubId} />
        </div>

        {selectedClubId && (
          <div className="space-y-8">
            <EventList clubId={selectedClubId} />
            <div className="border border-custom p-6 rounded-lg shadow-sm bg-background">
              <h3 className="text-xl font-bold text-primary mb-4">Create New Event</h3>
              <EventForm clubId={selectedClubId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
