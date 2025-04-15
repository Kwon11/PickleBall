export type Event = {
  id: string;
  title: string;
  description: string;
  event_date: string;
  max_players: number;
  created_by: string;
  participants?: {
    id: string;
    profiles: {
      full_name: string;
    };
    is_waitlisted: boolean;
  }[];
}; 