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
    <div className="border border-custom p-6 rounded-lg shadow-sm bg-card">
      <h3 className="text-xl font-bold text-primary">{event.title}</h3>
      <p className="text-secondary mt-2">{event.description}</p>
      <div className="mt-4 text-sm space-y-1">
        <p className="text-secondary">Date: {new Date(event.event_date).toLocaleString()}</p>
        <p className="text-secondary">Players: {currentParticipants}/{event.max_players}</p>
        {waitlistedParticipants.length > 0 && (
          <p className="text-secondary">Waitlist: {waitlistedParticipants.length} waiting</p>
        )}
      </div>

      <div className="mt-6">
        {isSignedUp ? (
          <div className="space-y-3">
            {isWaitlisted ? (
              <p className="text-yellow-400 font-medium">
                You are on the waitlist (Position #{currentUserPosition})
              </p>
            ) : (
              <p className="text-green-400 font-medium">You are signed up for this event!</p>
            )}
            <button
              onClick={handleCancelSignUp}
              disabled={isLoading}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Canceling...' : 'Cancel Sign-up'}
            </button>
          </div>
        ) : (
          <button
            onClick={handleSignUp}
            disabled={isLoading || (isFull && isWaitlisted)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Signing up...' : isFull ? 'Join Waitlist' : 'Sign Up'}
          </button>
        )}
      </div>

      <div className="mt-6">
        <h4 className="font-semibold text-primary mb-3">Participants:</h4>
        <div className="space-y-3">
          {participants.map(participant => (
            <div
              key={participant.id}
              className="flex items-center space-x-3"
            >
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-sm font-medium text-slate-300">
                {participant.profiles.full_name.charAt(0)}
              </div>
              <span className={participant.is_waitlisted ? 'text-tertiary' : 'text-secondary'}>
                {participant.profiles.full_name}
                {participant.is_waitlisted && ` (Waitlist #${
                  participants
                    .filter(p => p.is_waitlisted)
                    .findIndex(p => p.id === participant.id) + 1
                })`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 