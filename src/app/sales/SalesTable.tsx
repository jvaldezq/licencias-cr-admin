'use client';

import {ColumnDef} from "@tanstack/react-table";
import {ICashPaymentsAdvance, PAYMENT_TYPE} from "@/lib/definitions";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {DataTable} from "@/components/Table";
import {CRCFormatter} from "@/lib/NumberFormats";
import {PAYMENT_OPTIONS} from "@/app/events/forms/ViewEvent";
import dayjs from "dayjs";
import {FormInput} from "@/components/Forms/Input/FormInput";
import {Field, Form, SupportedInputs} from "react-final-form";
import {FormRadioBox} from "@/components/Forms/RadioBox.tsx/RadioBox";
import {useMemo} from "react";

interface Props {
    data: ICashPaymentsAdvance[];
}

const columns: ColumnDef<ICashPaymentsAdvance>[] = [{
    accessorKey: "amount", header: ({column}) => {
        return (<Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Monto
        </Button>)
    }, cell: ({row}) => CRCFormatter(row.getValue("amount")),
}, {
    accessorKey: "type", header: ({column}) => {
        return (<Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Tipo de pago
        </Button>)
    }, cell: ({row}) => PAYMENT_OPTIONS.find(option => option?.id === row.getValue("type") as unknown)?.name,
}, {
    accessorKey: "createdAt", header: ({column}) => {
        return (<Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Fecha y hora
        </Button>)
    }, cell: ({row}) => dayjs(row.getValue("createdAt")).format('DD/M/YYYY hh:mm A'),
}, {
    accessorKey: "payment.event.customer.name", header: ({column}) => {
        return (<Button
            className="px-0 font-bold text-base"
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
            Cliente
        </Button>)
    },
}]

export const SalesTable = (props: Props) => {
    const {data} = props
    const [filter, setFilter] = React.useState<string | undefined>(PAYMENT_TYPE.CARD);

    const filterData = useMemo(() => {
        return data.filter((item) => item.type === filter);
    }, [data, filter]);

    return <div className="pt-8 mt-8 border-t border-solid border-primary/[0.5]">
        <h1 className="font-semibold text-2xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Filtros</h1>
        <div className="mb-8 mt-4">
        <Form
            onSubmit={() => {}}
            initialValues={{
                type: filter,
            }}
            render={() => <Field
                name="type"
                component={FormRadioBox as unknown as SupportedInputs}
                label='Tipo de pago'
                onFilter={(type: string) => {
                    setFilter(type);
                }}
                className="justify-start"
                options={PAYMENT_OPTIONS}
            />}
        />
        </div>
        <DataTable
            data={filterData}
            columns={columns}
        />
    </div>
}