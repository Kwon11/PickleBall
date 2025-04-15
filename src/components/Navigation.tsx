"use client";

import Link from "next/link";
import { User } from "@supabase/supabase-js";
import {
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  PlusCircleIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

interface NavigationProps {
  user: User;
  onSignOut: () => Promise<void>;
}

export const Navigation = ({ user, onSignOut }: NavigationProps) => {
  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-slate-900 border-r border-slate-800 p-4">
      <div className="flex flex-col h-full">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-white">Pickleball</h1>
          <p className="text-sm text-slate-400">{user.email}</p>
        </div>

        <div className="flex-1 space-y-2">
          <Link
            href="/"
            className="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded-md transition-colors"
          >
            <HomeIcon className="h-5 w-5" />
            <span>Home</span>
          </Link>

          <Link
            href="/events"
            className="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded-md transition-colors"
          >
            <CalendarIcon className="h-5 w-5" />
            <span>My Events</span>
          </Link>

          <Link
            href="/clubs"
            className="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded-md transition-colors"
          >
            <UserGroupIcon className="h-5 w-5" />
            <span>My Clubs</span>
          </Link>

          <Link
            href="/clubs/new"
            className="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded-md transition-colors"
          >
            <PlusCircleIcon className="h-5 w-5" />
            <span>Create Club</span>
          </Link>
        </div>

        <button
          onClick={onSignOut}
          className="flex items-center space-x-2 text-slate-300 hover:text-white hover:bg-slate-800 p-2 rounded-md transition-colors"
        >
          <ArrowRightOnRectangleIcon className="h-5 w-5" />
          <span>Sign Out</span>
        </button>
      </div>
    </nav>
  );
}; 