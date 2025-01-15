'use client';

import {ColumnDef} from "@tanstack/react-table";
import {ICashPaymentsAdvance, PAYMENT_TYPE} from "@/lib/definitions";
import {Button} from "@/components/ui/button";
import * as React from "react";
import {DataTable} from "@/components/Table";
import {CRCFormatter} from "@/lib/NumberFormats";
import {PAYMENT_OPTIONS} from "@/app/events/forms/ViewEvent";
import dayjs from "dayjs";
import {Field, Form, SupportedInputs} from "react-final-form";
import {FormRadioBox} from "@/components/Forms/RadioBox.tsx/RadioBox";
import {useMemo} from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {ExportFileIcon} from "@/assets/icons/ExportFileIcon";

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

    const exportToPDF = () => {
        const doc = new jsPDF();

        const tableData = filterData.map((row) => [
            CRCFormatter(row.amount!),
            PAYMENT_OPTIONS.find((option) => option?.id === row.type as unknown)?.name || "",
            dayjs(row.createdAt).format("DD/M/YYYY hh:mm A"),
            row.payment?.event?.customer?.name || "",
        ]);

        const totalAmount = filterData.reduce((sum, row) => sum + row.amount!, 0);

        autoTable(doc, {
            head: [["Monto", "Tipo de pago", "Fecha y hora", "Cliente"]],
            body: tableData,
            styles: {
                fontSize: 10, // Set font size
                textColor: [56, 56, 54], // Default text color (dark gray)
            },
            headStyles: {
                fillColor: [202, 11, 16], // Header background color (blue)
                textColor: [255, 255, 255], // Header text color (white)
                fontStyle: "bold", // Header font style
            },
            bodyStyles: {
                fillColor: [245, 245, 245], // Body row background color (light gray)
                textColor: [56, 56, 54], // Body row text color
            },
            alternateRowStyles: {
                fillColor: [255, 255, 255], // Alternate row background color (white)
            },
        });

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const finalY = doc?.lastAutoTable?.finalY;
        doc.text(`Total: ${CRCFormatter(totalAmount)}`, 14, finalY + 10);

        doc.save("table-data.pdf");
    };

    return <div className="pt-8 mt-8">
        <h1 className="font-medium text-xl text-secondary animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Filtros</h1>
        <div className="mb-8 mt-4">
            <Form
                onSubmit={() => {
                }}
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
        <div className="flex justify-end my-2">
            <Button
                className="flex gap-2 items-center"
                variant="secondary"
                onClick={exportToPDF}
            >
                Exportar a PDF
                <ExportFileIcon/>
            </Button>
        </div>
        <DataTable
            data={filterData}
            columns={columns}
        />
    </div>
}