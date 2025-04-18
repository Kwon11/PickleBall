export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  event_end: string;
  location?: string;
  max_players: number;
  status: 'scheduled' | 'cancelled' | 'completed';
  skill_level: 'beginner' | 'intermediate' | 'advanced' | 'all';
  price: number;
  club_id: string;
  created_by: string;
  created_at: string;
  updated_at: string;
  event_participants: {
    user_id: string;
    status: 'confirmed' | 'waitlisted' | 'cancelled';
    joined_at: string;
    cancelled_at?: string;
  }[];
} 