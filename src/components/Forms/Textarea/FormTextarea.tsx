'use client';

import {
    ChangeEvent, ForwardedRef, forwardRef, InputHTMLAttributes, useCallback, useEffect, useRef,
} from 'react';
import IMask from 'imask';
import {CombinedInputProps} from '../types';
import {InputWrapper, InputWrapperProps} from '../InputWrapper';
import {cn} from "@/lib/utils";
import {Textarea} from "@/components/ui/textarea";

export interface FormTextareaProps extends CombinedInputProps<string>, Omit<InputWrapperProps, 'children'>, Omit<InputHTMLAttributes<HTMLTextAreaElement>, 'label' | 'name' | 'onChange'> {
    icon?: JSX.Element;
    mask?: string | object;
    hidden?: boolean;
}

export const FormTextarea = forwardRef((props: FormTextareaProps, ref: ForwardedRef<HTMLTextAreaElement>) => {
    const {
        className,
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
        icon,
        mask,
        hidden = false,
        ...rest
    } = props;
    const {onChange, value, ...inputRest} = input;
    const myRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (myRef?.current) {
            if (mask) {
                IMask(myRef.current, typeof mask === 'string' ? {mask: mask} : mask);
            }
        }
    }, [mask, hidden]);

    const myOnChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
    }, [onChange],);

    if (hidden) return null;

    return (<InputWrapper
        name={name}
        label={label}
        labelClassName={labelClassName}
        labelPosition={labelPosition}
        loading={loading}
        wrapperClassName={wrapperClassName}
        childrenClassName={childrenClassName}
        meta={meta}
    >
        <Textarea
            name={name}
            className={cn(className, value ? 'bg-success/[0.1]' : undefined)}
            ref={(node) => {
                myRef.current = node;
                if (typeof ref === 'function') {
                    ref(node);
                } else if (ref) {
                    ref.current = node;
                }
            }}
            placeholder={placeholder ?? (typeof label === 'string' ? label : '')}
            onChange={myOnChange}
            value={value}
            {...inputRest}
            {...rest}
        />
        {icon}
    </InputWrapper>);
});

FormTextarea.displayName = 'FormTextarea';