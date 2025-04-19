"use client";
import { useEffect, useState } from 'react';
import { signUpForEvent, cancelEventSignUp } from '@/app/actions/events';
import { Event } from "@/types/event";

type Profile = {
  full_name: string;
  display_name: string;
  email: string;
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'all';
};

type Participant = {
  id: string;
  user_id: string;
  status: 'confirmed' | 'waitlisted' | 'cancelled';
  joined_at: string;
  cancelled_at: string | null;
  profiles: Profile;
};

type EventViewProps = {
  event: Event;
};

export const EventView = ({ event }: EventViewProps) => {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentUserStatus, setCurrentUserStatus] = useState<'confirmed' | 'waitlisted' | 'cancelled' | null>(null);
  const [currentUserPosition, setCurrentUserPosition] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSignUp = async () => {
    try {
      await signUpForEvent(event.id);
      setIsSignedUp(true);
      setCurrentUserStatus('confirmed');
      fetchParticipants();
    } catch (err) {
      console.error("Error signing up:", err);
      setError("Failed to sign up for event");
    }
  };

  const handleCancelSignUp = async () => {
    try {
      await cancelEventSignUp(event.id);
      setIsSignedUp(false);
      setCurrentUserStatus(null);
      fetchParticipants();
    } catch (err) {
      console.error("Error canceling sign up:", err);
      setError("Failed to cancel sign up");
    }
  };

  const fetchParticipants = async () => {
    try {
      const response = await fetch(`/api/events/${event.id}/participants`);
      if (!response.ok) {
        throw new Error('Failed to fetch participants');
      }
      const data = await response.json();
      setParticipants(data);

      // Update current user's status and position
      const userParticipant = data.find((p: Participant) => p.user_id === event.created_by);
      if (userParticipant) {
        setCurrentUserStatus(userParticipant.status);
        if (userParticipant.status === 'waitlisted') {
          const position = data
            .filter((p: Participant) => p.status === 'waitlisted')
            .findIndex((p: Participant) => p.user_id === event.created_by) + 1;
          setCurrentUserPosition(position);
        }
      }
    } catch (err) {
      console.error('Error fetching participants:', err);
      setError("Failed to load participants");
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, [event.id]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4">
      <h3 className="text-lg font-semibold">{event.title}</h3>
      <p className="text-gray-600">{event.description}</p>
      <div className="mt-2 text-sm text-gray-500">
        <p>Date: {new Date(event.event_date).toLocaleString()}</p>
        <p>Location: {event.location}</p>
        <p>Max Players: {event.max_players}</p>
        <p>Skill Level: {event.skill_level}</p>
        <p>Price: ${event.price}</p>
      </div>
      <div className="mt-4">
        {!isSignedUp ? (
          <button
            onClick={handleSignUp}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Sign Up
          </button>
        ) : (
          <button
            onClick={handleCancelSignUp}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
          >
            Cancel Sign Up
          </button>
        )}
      </div>
      {currentUserStatus === 'waitlisted' && currentUserPosition && (
        <p className="mt-2 text-yellow-600">
          You are on the waitlist at position {currentUserPosition}
        </p>
      )}
      <div className="mt-4">
        <h4 className="font-semibold">Participants:</h4>
        <ul className="mt-2 space-y-2">
          {participants.map((participant) => (
            <li key={participant.id} className="text-sm">
              {participant.profiles.display_name} - {participant.status}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}; 