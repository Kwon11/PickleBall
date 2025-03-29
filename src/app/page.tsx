"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ClubForm } from '@/components/ClubForm'
import { ClubList } from '@/components/ClubList'
import { EventList } from '@/components/EventList'
import { EventForm } from '@/components/EventForm'

// const CLUB_ID = 'fb0d730f-5237-4e81-b353-a43b0d753707';
// const CLUB_ID = 'fb0d730f-5237-4e81-b353-a43b0d753707'; // kris and chan
const CLUB_ID = '1daf40b9-3814-437f-b113-fda8fb5360e9'; // kris and chan #2

const Home = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for changes on auth state (sign in, sign out, etc.)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="p-4">
      {!user ? (
        <button
          onClick={handleSignIn}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      ) : (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <p>Welcome, {user.email}</p>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Sign Out
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h2 className="text-xl font-bold mb-4">Create Club</h2>
              <ClubForm onSuccess={() => window.location.reload()} />
              
              <h2 className="text-xl font-bold mt-8 mb-4">Available Clubs</h2>
              <ClubList />
            </div>
            
            <div>
              <h2 className="text-xl font-bold mb-4">Events</h2>
              <EventList clubId={CLUB_ID} />
              <EventForm clubId={CLUB_ID} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
