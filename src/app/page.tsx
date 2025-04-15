"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { EventList } from '@/components/EventList'
import { EventForm } from '@/components/EventForm'
import { ClubSelector } from '@/components/ClubSelector'
import { Navigation } from '@/components/Navigation'

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
    <div className="min-h-screen bg-background">
      {!user ? (
        <div className="flex justify-center items-center min-h-screen">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-primary mb-6">Pickleball</h1>
            <button
              onClick={handleSignIn}
              className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors text-lg font-medium"
            >
              Sign in with Google
            </button>
          </div>
        </div>
      ) : (
        <div className="flex">
          <Navigation user={user} onSignOut={handleSignOut} />
          
          <main className="flex-1 ml-64 p-8">
            <div className="max-w-4xl mx-auto">
              <div className="mb-8 flex justify-between">
                <h2 className="text-2xl font-bold text-primary mb-4">Events</h2>
                <ClubSelector onClubSelect={setSelectedClubId} />
              </div>

              {selectedClubId && (
                <div className="space-y-8">
                  <EventList clubId={selectedClubId} />
                  <div className="border border-custom p-6 rounded-lg shadow-sm bg-background">
                    <h3 className="text-xl font-bold text-primary mb-4">Create New Event</h3>
                    <EventForm clubId={selectedClubId} />
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
}

export default Home;
