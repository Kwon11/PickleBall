"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Event } from "@/types/event";

type Profile = {
  full_name: string;
  email: string;
};

type Participant = {
  id: string;
  user_id: string;
  is_waitlisted: boolean;
  profiles: Profile;
};

interface EventViewProps {
  event: Event;
}

export const EventView = ({ event }: EventViewProps) => {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isWaitlisted, setIsWaitlisted] = useState(false);
  const [currentUserPosition, setCurrentUserPosition] = useState<number | null>(null);

  const fetchParticipants = async () => {
    const { data, error } = await supabase
      .from('event_participants')
      .select(`
        id,
        user_id,
        is_waitlisted,
        created_at,
        profiles!inner (
          full_name,
          email
        )
      `)
      .eq('event_id', event.id)
      .order('is_waitlisted', { ascending: true })
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching participants:', error);
      return;
    }

    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format received');
      setParticipants([]);
      return;
    }

    // Transform the data to match our types and calculate waitlist positions
    const transformedData = data.map(item => {
      const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
      return {
        ...item,
        profiles: {
          full_name: profile?.full_name || 'Unknown User',
          email: profile?.email || ''
        }
      };
    }) as Participant[];

    setParticipants(transformedData);

    // Update current user's waitlist position
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const position = transformedData
        .filter(p => p.is_waitlisted)
        .findIndex(p => p.user_id === user.id) + 1;
      setCurrentUserPosition(position || null);
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
      setIsWaitlisted(data.is_waitlisted);
    }
  };

  const handleSignUp = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("event_participants").insert({
      event_id: event.id,
      user_id: user.id,
      is_waitlisted: false,
    });

    if (error) {
      console.error("Error signing up:", error);
      return;
    }

    setIsSignedUp(true);
  };

  const handleCancelSignUp = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from("event_participants")
      .delete()
      .eq("event_id", event.id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error canceling sign up:", error);
      return;
    }

    setIsSignedUp(false);
    setIsWaitlisted(false);
  };

  useEffect(() => {
    checkSignUpStatus();
    fetchParticipants();
  }, [event.id]);

  const currentParticipants = participants.filter(p => !p.is_waitlisted).length;
  const waitlistedParticipants = participants.filter(p => p.is_waitlisted);
  const isFull = currentParticipants >= event.max_players;

  console.log('participant', participants);

  return (
    <div className="border border-slate-700 rounded-lg p-4 bg-slate-800 text-slate-100">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white">{event.title}</h3>
          <p className="text-slate-300 mt-1">{event.description}</p>
          <div className="mt-2 text-slate-400">
            <p>Date: {new Date(event.event_date).toLocaleDateString()}</p>
            <p>Time: {new Date(event.event_date).toLocaleTimeString()}</p>
            <p>
              Players: {currentParticipants}/{event.max_players}
            </p>
          </div>
        </div>
        <div className="flex flex-col space-y-2">
          {!isSignedUp && !isWaitlisted && (
            <button
              onClick={handleSignUp}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Sign Up
            </button>
          )}
          {isSignedUp && (
            <button
              onClick={handleCancelSignUp}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Cancel
            </button>
          )}
          {isWaitlisted && (
            <button
              onClick={handleCancelSignUp}
              className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Cancel Waitlist
            </button>
          )}
        </div>
      </div>
      {event.event_participants && event.event_participants.length > 0 && (
        <div className="mt-4">
          <h4 className="text-sm font-semibold text-slate-300 mb-2">Participants:</h4>
          <div className="flex flex-wrap gap-2">
            {event.event_participants.map((participant) => (
              <div
                key={participant.user_id}
                className="bg-slate-700 text-slate-200 px-3 py-1 rounded-full text-sm"
              >
                {participant.user_id.slice(0, 1).toUpperCase()}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}; 