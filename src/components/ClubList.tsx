"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Club = {
  id: string;
  name: string;
  description: string;
  created_at: string;
};

type ClubMember = {
  club_id: string;
  role: string;
};

export const ClubList = () => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [myMemberships, setMyMemberships] = useState<ClubMember[]>([]);

  const fetchClubs = async () => {
    const { data: clubs, error } = await supabase
      .from('clubs')
      .select('*');
    
    if (error) {
      console.error('Error fetching clubs:', error);
      return;
    }
    
    setClubs(clubs);
  };

  const fetchMyMemberships = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: memberships, error } = await supabase
      .from('club_members')
      .select('club_id, role')
      .eq('user_id', user.id);
    
    if (error) {
      console.error('Error fetching memberships:', error);
      return;
    }
    
    setMyMemberships(memberships);
  };

  useEffect(() => {
    fetchClubs();
    fetchMyMemberships();
  }, []);

  const handleJoinClub = async (clubId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('club_members')
      .insert([{
        club_id: clubId,
        user_id: user.id,
        role: 'member'
      }]);

    if (error) {
      console.error('Error joining club:', error);
      return;
    }

    fetchMyMemberships();
  };

  return (
    <div className="space-y-4">
      {clubs.map(club => {
        const membership = myMemberships.find(m => m.club_id === club.id);
        
        return (
          <div key={club.id} className="border p-4 rounded">
            <h3 className="text-lg font-semibold">{club.name}</h3>
            <p className="text-gray-600">{club.description}</p>
            {membership ? (
              <p className="mt-2 text-green-600">
                You're a {membership.role} of this club
              </p>
            ) : (
              <button
                onClick={() => handleJoinClub(club.id)}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Join Club
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
};