'use client';

import * as React from "react";
import {Field, Form, SupportedInputs} from "react-final-form";
import {FormCalendar} from "@/components/Forms/Calendar/FormCalendar";
import dayjs, {Dayjs} from "dayjs";
import {usePathname, useRouter} from "next/navigation";
import advancedFormat from "dayjs/plugin/advancedFormat";
import {useMemo} from "react";

dayjs.extend(advancedFormat);

interface Props {
    date: string;
}

export const SalesFilter = (props: Props) => {
    const {date} = props;
    const pathname = usePathname();
    const {replace} = useRouter();
    const dateParsed = useMemo(() => {
        return date ? atob(date) : undefined
    }, [date]);

    return <div className="mb-8 mt-4">
        <Form
            onSubmit={() => {
            }}
            initialValues={{
                date: dateParsed
            }}
            render={() => <Field
                name="date"
                component={FormCalendar as unknown as SupportedInputs}
                placeholder={dayjs().format('YYYY MMM DD')}
                onFilter={(date: Dayjs) => {
                    const params = new URLSearchParams();
                    params.set('date', btoa(date.toString()));
                    replace(`${pathname}?${params.toString()}`);
                }}
                label="Fecha"
            />}
        />
    </div>
}