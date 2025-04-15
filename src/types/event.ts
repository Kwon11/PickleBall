export interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  max_players: number;
  club_id: string;
  created_by: string;
  created_at: string;
  event_participants: {
    user_id: string;
  }[];
} 