'use client';

import { IEvent, IUser } from '@/lib/definitions';
import * as React from 'react';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import { useCallback, useState } from 'react';
import { ViewEvent } from '@/app/events/forms/ViewEvent';

dayjs.extend(advancedFormat);

interface Props {
  filters: string;
  data: IEvent[];
  user: IUser;
}

export const EventsCalendar = (props: Props) => {
  const { data } = props;
  const [hoveredEvent, setHoveredEvent] = useState<IEvent | null>(null);
  const [openView, setOpenView] = useState<boolean>(false);
  const [id, setId] = useState<string>('');

  const timeSlots = Array.from({ length: 12 }, (_, i) => {
    const hour = 6 + i;
    return `${hour}:00`;
  });

  const groupedEvents = data.reduce(
    (acc, event) => {
      const endTime = event.time;
      if (!acc[endTime]) {
        acc[endTime] = [];
      }
      acc[endTime].push(event);
      return acc;
    },
    {} as Record<string, IEvent[]>,
  );

  const handleClick = useCallback((event: IEvent) => {
    setId(event?.id);
    setOpenView(true);
  }, []);

  return (
    <section className="grid grid-cols-[60px_1fr] divide-x divide-gray-200 border border-solid rounded-2xl mt-4">
      <ViewEvent id={id} open={openView} setOpen={setOpenView} />
      <div className="border-r border-solid">
        {timeSlots.map((time) => (
          <div
            key={time}
            className="text-sm text-gray-500 text-right pr-4 h-[60px]"
          >
            {time}
          </div>
        ))}
      </div>

      <div className="relative overflow-x-scroll">
        {data.map((event) => {
          const calendarStartHour = 6; // Calendar starts at 6:00 AM
          const hourHeight = 60; // Each hour is 60px tall
          const pixelsPerMinute = hourHeight / 60; // 1px per minute

          const [eventHour, eventMinute] = event.time.split(':').map(Number);
          const hourDifference = eventHour - calendarStartHour;
          const totalMinutes = hourDifference * 60 + eventMinute;
          const top = totalMinutes * pixelsPerMinute;

          const index =
            groupedEvents[event.time]?.findIndex((e) => e.id === event.id) ?? 0;
          const left = index * 30;
          const isHovered = hoveredEvent?.id === event.id;

          return (
            <div
              onClick={() => handleClick(event)}
              key={event.id}
              className="absolute"
              style={{
                top: `${top}px`,
                left: `${left}px`,
                zIndex: isHovered ? 50 : 1,
              }}
            >
              <div
                className={`rounded cursor-pointer transition-all duration-200 ${
                  isHovered ? 'scale-100' : 'scale-90'
                }`}
                style={{
                  width: isHovered ? '200px' : '25px',
                  height: isHovered ? '80px' : '15px',
                  backgroundColor: event?.type?.name?.includes('Clase')
                    ? '#8e24aa'
                    : event?.licenseType?.color,
                }}
                onTouchStart={() => setHoveredEvent(event)}
                onTouchEnd={() => setHoveredEvent(null)}
                onMouseEnter={() => setHoveredEvent(event)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                {isHovered && (
                  <div className="p-2 text-xs text-white">
                    <div className="font-medium">
                      {event?.licenseType?.name} / {event.type.name}
                    </div>
                    <div className="opacity-90">{event.customer.name}</div>
                    <div className="opacity-75 text-[10px]">
                      {event?.asset?.name} • {event?.instructor?.name}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
