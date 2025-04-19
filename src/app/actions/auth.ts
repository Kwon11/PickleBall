'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function getSession() {
  const supabase = createServerActionClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session || !session.user.email) {
    return null;
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
    },
  };
} 