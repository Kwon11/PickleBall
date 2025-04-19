'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function createEvent(
  clubId: string,
  title: string,
  description: string,
  eventDate: string,
  eventEnd: string,
  location: string,
  maxPlayers: number,
  skillLevel: string,
  price: number
) {
  const supabase = createServerActionClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase
    .from('events')
    .insert({
      club_id: clubId,
      title,
      description,
      event_date: new Date(eventDate).toISOString(),
      event_end: new Date(eventEnd).toISOString(),
      location,
      max_players: maxPlayers,
      skill_level: skillLevel,
      price,
      created_by: session.user.id
    });

  if (error) {
    throw error;
  }

  revalidatePath('/');
}

export async function getEvents(clubId?: string, showOnlyUserEvents = false) {
  const supabase = createServerActionClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  let query = supabase
    .from("events")
    .select(`
      *,
      event_participants!inner (
        user_id
      )
    `)
    .order("event_date", { ascending: true });

  if (clubId) {
    query = query.eq("club_id", clubId);
  }

  if (showOnlyUserEvents) {
    query = query.eq('event_participants.user_id', session.user.id);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
}

export async function signUpForEvent(eventId: string) {
  const supabase = createServerActionClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase
    .from("event_participants")
    .insert({
      event_id: eventId,
      user_id: session.user.id,
      status: 'confirmed',
    });

  if (error) {
    throw error;
  }

  revalidatePath('/');
}

export async function cancelEventSignUp(eventId: string) {
  const supabase = createServerActionClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase
    .from("event_participants")
    .update({ status: 'cancelled', cancelled_at: new Date().toISOString() })
    .eq("event_id", eventId)
    .eq("user_id", session.user.id);

  if (error) {
    throw error;
  }

  revalidatePath('/');
} 