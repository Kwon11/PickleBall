"use client";

import { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Event } from '@/types/event';

type CalendarViewProps = {
  events: Event[];
  onEventClick: (event: Event) => void;
};

export const CalendarView = ({ events, onEventClick }: CalendarViewProps) => {
  const [view, setView] = useState<'dayGridMonth' | 'timeGridWeek' | 'timeGridDay'>('dayGridMonth');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const calendarRef = useRef<FullCalendar>(null);

  const calendarEvents = events.map(event => ({
    id: event.id,
    title: event.title,
    start: event.event_date,
    extendedProps: {
      description: event.description,
      maxPlayers: event.max_players,
      currentParticipants: event.participants?.length || 0,
      isFull: (event.participants?.length || 0) >= event.max_players
    }
  }));

  const handleViewChange = (newView: 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay') => {
    setView(newView);
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.changeView(newView);
    }
  };

  const eventContent = (arg: { event: { 
    title: string;
    start: string;
    extendedProps: {
      description: string;
      maxPlayers: number;
      currentParticipants: number;
      isFull: boolean;
    };
  }}) => {
    const event = arg.event;
    const isFull = event.extendedProps.isFull;
    const currentParticipants = event.extendedProps.currentParticipants;
    const maxPlayers = event.extendedProps.maxPlayers;

    if (view === 'dayGridMonth') {
      return (
        <div className="p-1">
          <div className="text-sm font-medium truncate">{event.title}</div>
          <div className="text-xs">
            {new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            {isFull && <span className="ml-1 text-red-500">(Full)</span>}
          </div>
        </div>
      );
    }

    if (view === 'timeGridWeek') {
      return (
        <div className="p-1">
          <div className="text-sm font-medium truncate">{event.title}</div>
          <div className="text-xs">
            {currentParticipants}/{maxPlayers} players
          </div>
        </div>
      );
    }

    // Day view
    return (
      <div className="p-2">
        <div className="text-sm font-medium">{event.title}</div>
        <div className="text-xs mt-1">{event.extendedProps.description}</div>
        <div className="text-xs mt-1">
          {currentParticipants}/{maxPlayers} players
          {isFull && <span className="ml-1 text-red-500">(Full)</span>}
        </div>
      </div>
    );
  };

  const handleEventClick = (info: { event: { id: string } }) => {
    const event = events.find(e => e.id === info.event.id);
    if (event) {
      setSelectedEvent(event);
      onEventClick(event);
    }
  };

  return (
    <div className="flex h-[80vh]">
      <div className={`${selectedEvent ? 'w-2/3' : 'w-full'} bg-card rounded-lg p-4`}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-primary">Calendar</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => handleViewChange('dayGridMonth')}
              className={`px-3 py-1 rounded-md ${
                view === 'dayGridMonth' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => handleViewChange('timeGridWeek')}
              className={`px-3 py-1 rounded-md ${
                view === 'timeGridWeek' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => handleViewChange('timeGridDay')}
              className={`px-3 py-1 rounded-md ${
                view === 'timeGridDay' ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-300'
              }`}
            >
              Day
            </button>
          </div>
        </div>

        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView={view}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: ''
          }}
          events={calendarEvents}
          eventContent={eventContent}
          eventClick={handleEventClick}
          height="100%"
          slotMinTime="06:00:00"
          slotMaxTime="22:00:00"
          allDaySlot={false}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }}
          themeSystem="standard"
          slotDuration="01:00:00"
          slotLabelInterval="01:00"
          slotLabelFormat={{
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          }}
          expandRows={true}
          stickyHeaderDates={true}
          nowIndicator={true}
          dayMaxEvents={true}
          weekends={true}
          dayHeaderFormat={{
            weekday: 'short',
            month: 'numeric',
            day: 'numeric'
          }}
        />
      </div>

      {selectedEvent && view === 'timeGridDay' && (
        <div className="w-1/3 bg-card rounded-lg p-4 ml-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-primary">Event Details</h3>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-slate-400 hover:text-slate-300"
            >
              ×
            </button>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-secondary">{selectedEvent.title}</h4>
              <p className="text-sm text-tertiary mt-1">{selectedEvent.description}</p>
            </div>
            <div className="text-sm">
              <p className="text-secondary">
                Time: {new Date(selectedEvent.event_date).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit',
                  hour12: true 
                })}
              </p>
              <p className="text-secondary">
                Players: {selectedEvent.participants?.length || 0}/{selectedEvent.max_players}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}; 