'use client';

import {
    ForwardedRef,
    forwardRef,
    InputHTMLAttributes,
    useState
} from 'react';
import {CombinedInputProps} from '../types';
import {InputWrapper, InputWrapperProps} from '../InputWrapper';
import {cn} from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button"
import { CalendarIcon } from "lucide-react"
import dayjs from "dayjs";


export interface FormCalendarProps extends CombinedInputProps<string>, Omit<InputWrapperProps, 'children'>, Omit<InputHTMLAttributes<HTMLButtonElement>, 'label' | 'name' | 'onChange'> {
    onFilter?: (value: string, key: string) => void;
    hidden?: boolean;
}

export const FormCalendar = forwardRef((props: FormCalendarProps, ref: ForwardedRef<HTMLButtonElement>) => {
    const {
        label,
        labelClassName,
        labelPosition,
        loading,
        name,
        placeholder,
        input,
        meta,
        wrapperClassName,
        childrenClassName,
        onFilter,
        hidden = false,
    } = props;
    const [date, setDate] = useState<Date | undefined>(new Date())
    const [open, setOpen] = useState(false)
    const {onChange} = input;

    if (hidden) return null;

    return <InputWrapper
            name={name}
            label={label}
            labelClassName={labelClassName}
            labelPosition={labelPosition}
            loading={loading}
            wrapperClassName={wrapperClassName}
            childrenClassName={childrenClassName}
            meta={meta}
        >
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant={"outline"}
                    className={cn(
                        "w-full pl-3 text-left font-normal",
                    )}
                >
                    {
                        date ? dayjs(date).format('YYYY MMM DD'): placeholder
                    }
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(date) => {
                        const newDate = dayjs(date?.toLocaleDateString()).format('YYYY-MM-DDTHH:mm:ss');
                        setDate(date);
                        onChange(newDate);
                        setOpen(false);
                        onFilter && onFilter(newDate, name);
                    }}
                    initialFocus
                />
            </PopoverContent>
        </Popover>
        </InputWrapper>;
});

FormCalendar.displayName = 'FormCalendar';