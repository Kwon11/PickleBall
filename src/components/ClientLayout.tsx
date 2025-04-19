"use client";

import { Navigation } from "@/components/Navigation";
import { SignInButton } from "@/components/SignInButton";

interface ClientLayoutProps {
  children: React.ReactNode;
  user: {
    email: string;
    id: string;
  } | null;
}

export function ClientLayout({ children, user }: ClientLayoutProps) {
  const handleSignOut = async () => {
    // This will be handled by a server action
    await fetch('/api/auth/signout', { method: 'POST' });
    window.location.href = '/';
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