"use client";
import { useEffect, useState } from 'react';
import { getClubs, joinClub } from '@/app/actions/clubs';

type Club = {
  id: string;
  name: string;
  description: string;
  created_at: string;
};

export const ClubList = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchClubs = async () => {
    try {
      const data = await getClubs();
      setClubs(data);
    } catch (err) {
      console.error('Error fetching clubs:', err);
      setError('Failed to load clubs');
    }
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleJoinClub = async (clubId: string) => {
    try {
      await joinClub(clubId);
      fetchClubs();
    } catch (err) {
      console.error('Error joining club:', err);
    }
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="space-y-4">
      {clubs.map((club) => (
        <div key={club.id} className="border border-gray-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold">{club.name}</h3>
          <p className="text-gray-600">{club.description}</p>
          <button
            onClick={() => handleJoinClub(club.id)}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Join Club
          </button>
        </div>
      ))}
    </div>
  );
};