"use client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { 
  CalendarIcon, 
  UserGroupIcon, 
  PlusCircleIcon, 
  ArrowRightOnRectangleIcon,
  HomeIcon
} from '@heroicons/react/24/outline';

type NavigationProps = {
  user: User | null;
  onSignOut: () => void;
};

export const Navigation = ({ user, onSignOut }: NavigationProps) => {
  if (!user) return null;

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 p-6">
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Pickleball</h1>
          <p className="text-slate-400 text-sm mt-1">{user.email}</p>
        </div>

        <div className="flex-1 space-y-2">
          <Link 
            href="/" 
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <HomeIcon className="w-5 h-5" />
            <span>Home</span>
          </Link>
          <Link 
            href="/events" 
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <CalendarIcon className="w-5 h-5" />
            <span>My Events</span>
          </Link>
          <Link 
            href="/clubs" 
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <UserGroupIcon className="w-5 h-5" />
            <span>My Clubs</span>
          </Link>
          <Link 
            href="/create-club" 
            className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <PlusCircleIcon className="w-5 h-5" />
            <span>Create Club</span>
          </Link>
        </div>

        <button
          onClick={onSignOut}
          className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <ArrowRightOnRectangleIcon className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
}; 