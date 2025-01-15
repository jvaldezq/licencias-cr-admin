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

  // const groupedEvents = data.reduce(
  //   (acc, event) => {
  //     const endTime = event.time;
  //     if (!acc[endTime]) {
  //       acc[endTime] = [];
  //     }
  //     acc[endTime].push(event);
  //     return acc;
  //   },
  //   {} as Record<string, IEvent[]>,
  // );

  const handleClick = useCallback((event: IEvent) => {
    setId(event?.id);
    setOpenView(true);
  }, []);

  return (
    <section className="grid grid-cols-[80px_1fr] divide-x divide-gray-200">
      <ViewEvent id={id} open={openView} setOpen={setOpenView} />
      <div className="space-y-6 py-4">
        {timeSlots.map((time) => (
          <div key={time} className="text-sm text-gray-500 text-right pr-4">
            {time}
          </div>
        ))}
      </div>

      <div className="relative overflow-x-scroll h-[600px]">
        {data.map((event) => {
          const calendarStartHour = 6; // Calendar starts at 6:00 AM
          const pixelsPerMinute = 60 / 60; // 1.333 pixels per minute
          const [eventHour, eventMinute] = event.time.split(':').map(Number);
          const hourDifference = eventHour - calendarStartHour;
          const totalMinutes = hourDifference * 60 + eventMinute;
          const top = totalMinutes * pixelsPerMinute;

          // const startHour = parseInt(event.time.split(':')[0]);
          // const startMinute = parseInt(event.time.split(':')[1] || '0');
          // const top = (startHour - 7) * 60 + startMinute;

          const index =
            groupedEvents[event.time]?.findIndex((e) => e.id === event.id) ?? 0;
          const left = index * 30;
          // const sameTimeAppointments = groupedEvents[event.time];
          // const index = sameTimeAppointments.findIndex(
          //   (a) => a.id === event.id,
          // );
          // const left = index * 30;

          const isHovered = hoveredEvent?.id === event.id;

          console.log({
            id: event.id,
            top,
            left,
            time: event.time,
            groupedIndex: index,
          });

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
                  height: isHovered ? '80px' : '10px',
                  backgroundColor: event?.licenseType?.color,
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

// 8e24aa
