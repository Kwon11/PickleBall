"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Event = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  max_players: number;
  created_by: string;
};

type Profile = {
  full_name: string;
  email: string;
};

type Participant = {
  id: string;
  user_id: string;
  is_waitlisted: boolean;
  waitlist_position: number | null;
  profiles: Profile;
};

type EventViewProps = {
  event: Event;
};

export const EventView = ({ event }: EventViewProps) => {
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isWaitlisted, setIsWaitlisted] = useState(false);
  const [waitlistPosition, setWaitlistPosition] = useState<number | null>(null);

  const fetchParticipants = async () => {
    const { data, error } = await supabase
      .from('event_participants')
      .select(`
        id,
        user_id,
        is_waitlisted,
        waitlist_position,
        profiles!inner (
          full_name,
          email
        )
      `)
      .eq('event_id', event.id)
      .order('is_waitlisted', { ascending: true })
      .order('waitlist_position', { ascending: true });

    if (error) {
      console.error('Error fetching participants:', error);
      return;
    }

    if (!data || !Array.isArray(data)) {
      console.error('Invalid data format received');
      setParticipants([]);
      return;
    }

    // Transform the data to match our types
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
      setWaitlistPosition(data.waitlist_position);
    }
  };

  const handleSignUp = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user logged in');
      setIsLoading(false);
      return;
    }

    const currentParticipants = participants.filter(p => !p.is_waitlisted).length;
    const isFull = currentParticipants >= event.max_players;

    const { error } = await supabase
      .from('event_participants')
      .insert([{
        event_id: event.id,
        user_id: user.id,
        is_waitlisted: isFull
      }]);

    if (error) {
      console.error('Error signing up for event:', error);
      setIsLoading(false);
      return;
    }

    setIsSignedUp(true);
    setIsWaitlisted(isFull);
    await fetchParticipants();
    setIsLoading(false);
  };

  const handleCancelSignUp = async () => {
    setIsLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error('No user logged in');
      setIsLoading(false);
      return;
    }

    const { error } = await supabase
      .from('event_participants')
      .delete()
      .eq('event_id', event.id)
      .eq('user_id', user.id);

    if (error) {
      console.error('Error canceling sign up:', error);
      setIsLoading(false);
      return;
    }

    setIsSignedUp(false);
    setIsWaitlisted(false);
    setWaitlistPosition(null);
    await fetchParticipants();
    setIsLoading(false);
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
    <div className="border p-4 rounded shadow">
      <h3 className="text-lg font-bold">{event.title}</h3>
      <p className="text-gray-600 mt-1">{event.description}</p>
      <div className="mt-2 text-sm">
        <p>Date: {new Date(event.event_date).toLocaleString()}</p>
        <p>Players: {currentParticipants}/{event.max_players}</p>
        {waitlistedParticipants.length > 0 && (
          <p>Waitlist: {waitlistedParticipants.length} waiting</p>
        )}
      </div>

      <div className="mt-4">
        {isSignedUp ? (
          <div className="space-y-2">
            {isWaitlisted ? (
              <p className="text-yellow-600">
                You are on the waitlist (Position {waitlistPosition})
              </p>
            ) : (
              <p className="text-green-600">You are signed up for this event!</p>
            )}
            <button
              onClick={handleCancelSignUp}
              disabled={isLoading}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 disabled:opacity-50"
            >
              {isLoading ? 'Canceling...' : 'Cancel Sign-up'}
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignUp}
            disabled={isLoading || (isFull && !isWaitlisted)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Signing up...' : isFull ? 'Join Waitlist' : 'Sign Up'}
          </button>
        )}
      </div>

      <div className="mt-4">
        <h4 className="font-semibold mb-2">Participants:</h4>
        <div className="space-y-2">
          {participants.map(participant => (
            <div
              key={participant.id}
              className="flex items-center space-x-2"
            >
              <div className="w-6 h-6 rounded-full bg-gray-300" />
              <span className={participant.is_waitlisted ? 'text-gray-500' : ''}>
                {participant.profiles.full_name}
                {participant.is_waitlisted && ` (Waitlist #${participant.waitlist_position})`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 