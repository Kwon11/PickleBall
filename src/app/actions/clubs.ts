'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export async function createClub(name: string, description: string) {
  const supabase = createServerActionClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  const { data: club, error } = await supabase
    .from('clubs')
    .insert([{
      name,
      description,
      created_by: session.user.id
    }])
    .select()
    .single();

  if (error) {
    throw error;
  }

  // Automatically make the creator an admin of the club
  const { error: memberError } = await supabase
    .from('club_members')
    .insert([{
      club_id: club.id,
      user_id: session.user.id,
      role: 'admin'
    }]);

  if (memberError) {
    throw memberError;
  }

  revalidatePath('/clubs');
  return club;
}

export async function getClubs() {
  const supabase = createServerActionClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  const { data: clubs, error } = await supabase
    .from('clubs')
    .select('*')
    .in('id', 
      (await supabase
        .from('club_members')
        .select('club_id')
        .eq('user_id', session.user.id)
      ).data?.map(member => member.club_id) || []
    );

  if (error) {
    throw error;
  }

  return clubs;
}

export async function joinClub(clubId: string) {
  const supabase = createServerActionClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    throw new Error('Not authenticated');
  }

  const { error } = await supabase
    .from('club_members')
    .insert([{
      club_id: clubId,
      user_id: session.user.id,
      role: 'member'
    }]);

  if (error) {
    throw error;
  }

  revalidatePath('/clubs');
} 