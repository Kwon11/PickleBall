"use client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

type NavigationProps = {
  user: User | null;
  onSignOut: () => void;
};

export const Navigation = ({ user, onSignOut }: NavigationProps) => {
  if (!user) return null;

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-background border-r border-custom p-6">
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-primary">Pickleball</h1>
          <p className="text-secondary text-sm mt-1">{user.email}</p>
        </div>

        <div className="flex-1 space-y-4">
          <Link href="/" className="block text-secondary hover:text-primary transition-colors">
            My Events
          </Link>
          <Link href="/clubs" className="block text-secondary hover:text-primary transition-colors">
            My Clubs
          </Link>
          <Link href="/create-club" className="block text-secondary hover:text-primary transition-colors">
            Create Club
          </Link>
        </div>

        <button
          onClick={onSignOut}
          className="mt-4 text-red-500 hover:text-red-600 transition-colors"
        >
          Sign Out
        </button>
      </div>
    </nav>
  );
}; 