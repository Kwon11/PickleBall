"use client";
import { useState } from "react";
import { ClubForm } from '@/components/ClubForm'
import { ClubList } from '@/components/ClubList'

export default function ClubsPage() {
  const [isCreating, setIsCreating] = useState(false);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-primary">My Clubs</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Create Club
        </button>
      </div>

      {isCreating && (
        <div className="border border-custom p-6 rounded-lg shadow-sm bg-background mb-8">
          <h3 className="text-xl font-bold text-primary mb-4">Create New Club</h3>
          <ClubForm onSuccess={() => {
            setIsCreating(false);
            window.location.reload();
          }} />
        </div>
      )}

      <ClubList />
    </div>
  );
} 