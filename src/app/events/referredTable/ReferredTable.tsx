'use client';

import {ColumnDef, Row} from "@tanstack/react-table";
import {EventStatus, IEvent, IUser} from "@/lib/definitions";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {DataTable} from "@/components/Table";
import dayjs from "dayjs";
import advancedFormat from 'dayjs/plugin/advancedFormat';
import {EditEvent} from "@/app/events/forms/EditEvent";
import {DeleteEvent} from "@/app/events/forms/DeleteEvent";
import {CompleteEvent} from "@/app/events/forms/CompleteEvent";

dayjs.extend(advancedFormat);

interface Props {
    filters: string;
    data: IEvent[]
    user: IUser
}

export const ReferredTable = (props: Props) => {
    const {data, user} = props

    const allowActions = user?.access?.receptionist || user?.access?.admin;

    const columns: ColumnDef<IEvent>[] = [{
        accessorKey: "customer.schedule.startDate", header: () => {
            return (<Button
                className="px-0 font-bold text-base"
                variant="ghost"
            >
                Inicio
            </Button>)
        }, cell: ({row}: { row: Row<IEvent> }) => {
            const [startTime, endTime] = row?.original?.customer?.schedule?.startTime?.split(':') || [];
            return <div className="capitalize">
                {dayjs().set('hour', +startTime).set('minute', +endTime).format('hh:mm A')}
            </div>
        },
    }, {
        accessorKey: "customer.schedule.endDate", header: () => {
            return (<Button
                className="px-0 font-bold text-base"
                variant="ghost"
            >
                Fin
            </Button>)
        }, cell: ({row}: { row: Row<IEvent> }) => {
            const [startTime, endTime] = row?.original?.customer?.schedule?.endTime?.split(':') || [];
            return <div className="capitalize">
                {dayjs().set('hour', +startTime).set('minute', +endTime).format('hh:mm A')}
            </div>
        },
    }, {
        accessorKey: "asset.name", header: () => {
            return (<Button
                className="px-0 font-bold text-base"
                variant="ghost"
            >
                Vehículo
            </Button>)
        }, cell: ({row}: { row: Row<IEvent> }) => {
            const name = row?.original?.asset?.name || 'Sin asignar';
            const color = row?.original?.licenseType?.color || '#d3d3d3';
            const licenseType = row?.original?.licenseType?.name ? `(${row?.original?.licenseType?.name})` : undefined;
            return <div
                className={`capitalize flex gap-2 items-center ${!row?.original?.asset?.name ? 'text-error font-bold' : ''}`}>
                <div className="h-4 w-4 rounded-full" style={{backgroundColor: color}}/>
                {`${licenseType} ${name}`}
            </div>
        },
    }, {
        accessorKey: "location.name", header: () => {
            return (<Button
                className="px-0 font-bold text-base"
                variant="ghost"
            >
                Sede
            </Button>)
        }, cell: ({row}: { row: Row<IEvent> }) => {
            const name = row?.original?.location?.name;
            return <div className="capitalize">
                {name}
            </div>
        },
    }, {
        accessorKey: "customer.name", header: () => {
            return (<Button
                className="px-0 font-bold text-base"
                variant="ghost"
            >
                Cliente
            </Button>)
        }, cell: ({row}: { row: Row<IEvent> }) => {
            const name = row?.original?.customer?.name;
            return <div className="capitalize">
                {name}
            </div>
        },
    }, {
        id: "actions", header: () => {
            return (<Button
                className="px-0 font-bold text-base"
                variant="ghost"
            >
                Acciones
            </Button>)
        }, enableHiding: false, cell: ({row}: { row: Row<IEvent> }) => {
            if (row.original.status === EventStatus.COMPLETED) {
                return <p className="font-bold">
                    Completado
                </p>
            }
            return <div className="flex gap-4">
                <EditEvent id={row.original.id} user={user}/>
                <DeleteEvent id={row.original.id}/>
                <CompleteEvent id={row.original.id}/>
            </div>
        },
    }].filter((column) => allowActions ? true : column.id !== 'actions');

    if (!data.length) {
        return null;
    }

    return <>
        <h1 className="my-6 text-center py-2 text-lg font-semibold text-primary rounded-2xl bg-secondary/[0.2]">Referidos</h1>
        <DataTable
            data={data}
            columns={columns}
        />
    </>
}