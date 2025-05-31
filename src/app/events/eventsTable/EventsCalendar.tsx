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
  const { data, filters, user } = props;
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

  const filteredDate = filters
    ? dayjs(JSON.parse(atob(filters)).date).format('YYYY-MM-DD')
    : dayjs().format('YYYY-MM-DD');

  return (
    <section className="grid grid-cols-[60px_1fr] divide-x divide-gray-200 border border-solid rounded-2xl mt-4">
      <ViewEvent id={id} open={openView} setOpen={setOpenView} user={user} />
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
        <div className="absolute top-0 left-0 flex justify-center items-center w-full h-full">
          <h1 className="text-primary/[0.5] font-bold text-xl">
            {filteredDate}
          </h1>
        </div>
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

          const start = dayjs(
            `2000-01-01 ${event?.customer?.schedule?.startTime}`,
            'YYYY-MM-DD hh:mm A',
          );
          const end = dayjs(
            `2000-01-01 ${event?.customer?.schedule?.endTime}`,
            'YYYY-MM-DD hh:mm A',
          );

          const hoursDiff = end.diff(start, 'hour', true);

          return (
            <div
              onClick={() => handleClick(event)}
              key={event.id}
              className="absolute"
              style={{
                top: isHovered ? `${top - 50}px` : `${top}px`,
                left: `${left * hoursDiff}px`,
                zIndex: isHovered ? 50 : 1,
              }}
            >
              <div
                className={`rounded cursor-pointer transition-all duration-200 flex flex-col items-center justify-center ${
                  isHovered ? 'scale-100' : 'scale-90'
                }`}
                style={{
                  width: isHovered ? '230px' : event?.type?.name?.includes('Clase')
                    ? `${hoursDiff * 30}px` : '30px',
                  height: isHovered ? '80px' : '20px',
                  backgroundColor: event?.type?.name?.includes('Clase')
                    ? '#8e24aa'
                    : event?.licenseType?.color,
                }}
                onTouchStart={() => setHoveredEvent(event)}
                onTouchEnd={() => setHoveredEvent(null)}
                onMouseEnter={() => setHoveredEvent(event)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                {!isHovered && (
                  <p className="text-white font-bold">
                    {event?.asset?.name
                      .trim()
                      .split(/\s+/) // Split by any amount of whitespace
                      .map((word) => word[0].toUpperCase())
                      .join('')
                      .slice(0, 2)}
                  </p>
                )}
                {isHovered && (
                  <div className="py-1 text-xs text-white pl-8 pr-1 flex flex-col justify-center items-end text-end z-50">
                    <div className="font-medium">
                      {event?.licenseType?.name} / {event.type.name}
                    </div>
                    <div className="opacity-90">{event.time}</div>
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
