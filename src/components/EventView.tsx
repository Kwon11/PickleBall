"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
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
  cancelled_at?: string;
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

  const fetchParticipants = async () => {
    const { data, error } = await supabase
      .from('event_participants')
      .select(`
        id,
        user_id,
        status,
        joined_at,
        cancelled_at,
        profiles!inner (
          full_name,
          display_name,
          email,
          skill_level
        )
      `)
      .eq('event_id', event.id)
      .order('status', { ascending: true })
      .order('joined_at', { ascending: true });

    if (error) {
      console.error('Error fetching participants:', error);
      return;
    }

    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format received');
      setParticipants([]);
      return;
    }

    const transformedData = data.map(item => {
      const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
      return {
        ...item,
        profiles: {
          full_name: profile?.full_name || 'Unknown User',
          display_name: profile?.display_name || 'Unknown User',
          email: profile?.email || '',
          skill_level: profile?.skill_level || 'intermediate'
        }
      };
    }) as Participant[];

    setParticipants(transformedData);

    // Update current user's status and position
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const userParticipant = transformedData.find(p => p.user_id === user.id);
      if (userParticipant) {
        setCurrentUserStatus(userParticipant.status);
        if (userParticipant.status === 'waitlisted') {
          const position = transformedData
            .filter(p => p.status === 'waitlisted')
            .findIndex(p => p.user_id === user.id) + 1;
          setCurrentUserPosition(position);
        }
      }
    }
  };

  const checkSignUpStatus = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('event_participants')
      .select('*')
      .eq('event_id', event.id)
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Error checking sign up status:', error);
      return;
    }

    if (data) {
      setIsSignedUp(true);
      setCurrentUserStatus(data.status);
    }
  };

  const handleSignUp = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("event_participants").insert({
      event_id: event.id,
      user_id: user.id,
      status: 'confirmed',
    });

    if (error) {
      console.error("Error signing up:", error);
      return;
    }

    setIsSignedUp(true);
    setCurrentUserStatus('confirmed');
    fetchParticipants();
  };

  const handleCancelSignUp = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("event_participants")
      .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
      .eq("event_id", event.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error canceling sign up:", error);
      return;
    }

    setIsSignedUp(false);
    setCurrentUserStatus(null);
    fetchParticipants();
  };

  useEffect(() => {
    checkSignUpStatus();
    fetchParticipants();
  }, [event.id]);

  const confirmedParticipants = participants.filter(p => p.status === 'confirmed');
  const waitlistedParticipants = participants.filter(p => p.status === 'waitlisted');
  const isFull = confirmedParticipants.length >= event.max_players;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4">{event.title}</h2>
      <p className="text-gray-600 mb-4">{event.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="font-semibold">Location:</p>
          <p>{event.location || 'TBD'}</p>
        </div>
        <div>
          <p className="font-semibold">Skill Level:</p>
          <p>{event.skill_level}</p>
        </div>
        <div>
          <p className="font-semibold">Start Time:</p>
          <p>{new Date(event.event_date).toLocaleString()}</p>
        </div>
        <div>
          <p className="font-semibold">End Time:</p>
          <p>{new Date(event.event_end).toLocaleString()}</p>
        </div>
        <div>
          <p className="font-semibold">Price:</p>
          <p>${event.price.toFixed(2)}</p>
        </div>
        <div>
          <p className="font-semibold">Players:</p>
          <p>{confirmedParticipants.length}/{event.max_players}</p>
        </div>
      </div>

      <div className="mb-4">
        <h3 className="font-semibold mb-2">Confirmed Players:</h3>
        <ul className="space-y-1">
          {confirmedParticipants.map(participant => (
            <li key={participant.id} className="flex items-center justify-between">
              <span>{participant.profiles.display_name}</span>
              <span className="text-sm text-gray-500">{participant.profiles.skill_level}</span>
            </li>
          ))}
        </ul>
      </div>

      {waitlistedParticipants.length > 0 && (
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Waitlist:</h3>
          <ul className="space-y-1">
            {waitlistedParticipants.map(participant => (
              <li key={participant.id} className="flex items-center justify-between">
                <span>{participant.profiles.display_name}</span>
                <span className="text-sm text-gray-500">{participant.profiles.skill_level}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {currentUserStatus === 'waitlisted' && currentUserPosition && (
        <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg mb-4">
          You are #{currentUserPosition} on the waitlist
        </div>
      )}

      {!isSignedUp && !isFull && (
        <button
          onClick={handleSignUp}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Sign Up
        </button>
      )}

      {!isSignedUp && isFull && (
        <button
          onClick={handleSignUp}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
        >
          Join Waitlist
        </button>
      )}

      {isSignedUp && (
        <button
          onClick={handleCancelSignUp}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
        >
          Cancel Sign Up
        </button>
      )}
    </div>
  );
}; 