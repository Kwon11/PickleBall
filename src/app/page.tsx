"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { ClubForm } from '@/components/ClubForm'
import { ClubList } from '@/components/ClubList'
import { EventList } from '@/components/EventList'
import { EventForm } from '@/components/EventForm'
import { ClubSelector } from '@/components/ClubSelector'

const Home = () => {
  const [user, setUser] = useState<User | null>(null);
  const [selectedClubId, setSelectedClubId] = useState<string>('');

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
    <div className="p-6 max-w-7xl mx-auto">
      {!user ? (
        <div className="flex justify-center items-center min-h-screen">
          <button
            onClick={handleSignIn}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors text-lg font-medium"
          >
            Sign in with Google
          </button>
        </div>
      ) : (
        <div>
          <div className="mb-6 flex justify-between items-center">
            <p className="text-secondary">Welcome, {user.email}</p>
            <button
              onClick={handleSignOut}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Create Club</h2>
              <ClubForm onSuccess={() => window.location.reload()} />
              
              <h2 className="text-2xl font-bold text-primary mt-12 mb-6">Available Clubs</h2>
              <ClubList />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-primary mb-6">Events</h2>
              <ClubSelector onClubSelect={setSelectedClubId} />
              {selectedClubId && (
                <>
                  <EventList clubId={selectedClubId} />
                  <EventForm clubId={selectedClubId} />
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
