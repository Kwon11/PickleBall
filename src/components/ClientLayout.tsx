"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import { Navigation } from "@/components/Navigation";
import { SignInButton } from "@/components/SignInButton";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen bg-background">
      {!user ? (
        <div className="flex flex-col items-center justify-center min-h-screen">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-primary mb-4">Welcome to Pickleball</h1>
            <p className="text-secondary text-lg">Sign in to manage your clubs and events</p>
          </div>
          <SignInButton />
        </div>
      ) : (
        <div className="flex">
          <Navigation user={user} onSignOut={handleSignOut} />
          <main className="flex-1 ml-64">{children}</main>
        </div>
      )}
    </div>
  );
} 