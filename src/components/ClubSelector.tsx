"use client";
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Club = {
  id: string;
  name: string;
  description: string;
};

type ClubSelectorProps = {
  onClubSelect: (clubId: string) => void;
};

export const ClubSelector = ({ onClubSelect }: ClubSelectorProps) => {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [selectedClubId, setSelectedClubId] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  const fetchClubs = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('clubs')
      .select('*')
      .in('id', 
        (await supabase
          .from('club_members')
          .select('club_id')
          .eq('user_id', user.id)
        ).data?.map(member => member.club_id) || []
      );

    if (error) {
      console.error('Error fetching clubs:', error);
      return;
    }

    setClubs(data as Club[]);
    
    // Select the first club by default if none is selected
    if (data && data.length > 0 && !selectedClubId) {
      setSelectedClubId(data[0].id);
      onClubSelect(data[0].id);
    }
    
    setIsLoading(false);
  };

  useEffect(() => {
    fetchClubs();
  }, []);

  const handleClubChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const clubId = e.target.value;
    setSelectedClubId(clubId);
    onClubSelect(clubId);
  };

  if (isLoading) {
    return <div>Loading clubs...</div>;
  }

  if (clubs.length === 0) {
    return <div>You are not a member of any clubs.</div>;
  }

  return (
    <div className="mb-4 flex justify-between items-center">
      <label htmlFor="club-select" className="block text-md font-medium mb-1">
        Select Club
      </label>
      <select
        id="club-select"
        value={selectedClubId}
        onChange={handleClubChange}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-black h-[80%]"
      >
        {clubs.map(club => (
          <option key={club.id} value={club.id}>
            {club.name}
          </option>
        ))}
      </select>
    </div>
  );
}; 