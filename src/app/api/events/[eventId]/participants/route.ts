import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { eventId: string } }
) {
  const supabase = createRouteHandlerClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

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
    .eq('event_id', params.eventId)
    .order('status', { ascending: true })
    .order('joined_at', { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data || !Array.isArray(data)) {
    return NextResponse.json({ error: 'Invalid data format' }, { status: 500 });
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
  });

  return NextResponse.json(transformedData);
} 