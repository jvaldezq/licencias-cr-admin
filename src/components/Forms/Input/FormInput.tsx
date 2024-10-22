'use client';

import {
    ChangeEvent,
    ForwardedRef,
    forwardRef,
    InputHTMLAttributes,
    useCallback,
    useEffect,
    useRef,
} from 'react';
import IMask from 'imask';
import {CombinedInputProps} from '../types';
import {InputWrapper, InputWrapperProps} from '../InputWrapper';
import {cn} from "@/lib/utils";
import {Input} from "@/components/ui/input";

export interface FormInputProps extends CombinedInputProps<string>, Omit<InputWrapperProps, 'children'>, Omit<InputHTMLAttributes<HTMLInputElement>, 'label' | 'name' | 'onChange'> {
    icon?: JSX.Element;
    mask?: string | object;
    hidden?: boolean;
}

export const FormInput = forwardRef((props: FormInputProps, ref: ForwardedRef<HTMLInputElement>) => {
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
    const {onChange, ...inputRest} = input;
    const myRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (myRef?.current) {
            if (mask) {
                IMask(myRef.current, typeof mask === 'string' ? {mask: mask} : mask);
            }
        }
    }, [mask, hidden]);

    const myOnChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
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
            <Input
                name={name}
                className={cn(className)}
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
                {...inputRest}
                {...rest}
            />
            {icon}
        </InputWrapper>);
});

FormInput.displayName = 'FormInput';