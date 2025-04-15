"use client";
import { useState } from "react";
import { ClubForm } from '@/components/ClubForm'
import { ClubList } from '@/components/ClubList'

export default function ClubsPage() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-primary">My Clubs</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            {showForm ? 'Cancel' : 'Create Club'}
          </button>
        </div>

        {showForm ? (
          <div className="bg-card rounded-lg p-6 mb-8">
            <ClubForm onSuccess={() => setShowForm(false)} />
          </div>
        ) : (
          <div className="bg-card rounded-lg p-6">
            <ClubList />
          </div>
        )}
      </div>
    </div>
  );
} 