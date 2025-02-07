import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';

let closure = 0;
const DayCell = (props) => {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      const startOfDay = new Date(props.day.date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(props.day.date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', startOfDay.toISOString())
        .lte('event_date', endOfDay.toISOString());

      if (!error && data) {
        setEvents(data);
      }
    };

    fetchEvents();
  }, [props.day.date]);

  if (closure === 0) {
    console.log('daycell props', props);
    closure++;
  }
  return (
    <div className="relative p-2">
      <td className={'rdp-day'}>{format(props.day.date, 'd')}</td>
      {events.map(event => (
        <div 
          key={event.id}
          className="text-xs bg-blue-100 p-1 mt-1 rounded"
          title={event.description}
        >
          {event.title}
        </div>
      ))}
    </div>
  );
}

export default DayCell;