"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export const ClubForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const { data: club, error } = await supabase
      .from('clubs')
      .insert([{
        name: formData.name,
        description: formData.description,
        created_by: (await supabase.auth.getUser()).data.user?.id
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating club:', error);
      return;
    }

    // Automatically make the creator an admin of the club
    const { error: memberError } = await supabase
      .from('club_members')
      .insert([{
        club_id: club.id,
        user_id: (await supabase.auth.getUser()).data.user?.id,
        role: 'admin'
      }]);

    if (memberError) {
      console.error('Error adding member:', memberError);
      return;
    }

    if (onSuccess) onSuccess();
    setFormData({ name: '', description: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Club Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm text-black"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Create Club
      </button>
    </form>
  );
};