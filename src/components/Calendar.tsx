'use client';

import React from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, Event } from 'react-big-calendar';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import dayjs from 'dayjs';
import weekday from 'dayjs/plugin/weekday';
import localeData from 'dayjs/plugin/localeData';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import {IEvent} from "@/lib/definitions";

// Extend dayjs with necessary plugins
dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// Create custom localizer using dayjs functions
const dayjsLocalizer = {
    format: (date: Date, format: string) => dayjs(date).format(format),
    parse: (value: string, format: string) => dayjs(value, format).toDate(),
    startOfWeek: () => dayjs().startOf('week').toDate(),
    getDay: (date: Date) => dayjs(date).day(),
};

const localizer = dateFnsLocalizer({
    format: dayjsLocalizer.format,
    parse: dayjsLocalizer.parse,
    startOfWeek: dayjsLocalizer.startOfWeek,
    getDay: dayjsLocalizer.getDay,
    locales: {},
});

// Define a basic event type (you can extend it as needed)
interface MyEvent extends Event {
    title: string;
    start: Date;
    end: Date;
}

interface Props {
    data: IEvent[];
}

export function Calendar(props: Props) {
    const { data } = props;
    console.log('data', data);
    const events: MyEvent[] = [
        {
            title: 'Meeting',
            start: new Date(),
            end: new Date(),
        },
    ];

    return  <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
    />
}