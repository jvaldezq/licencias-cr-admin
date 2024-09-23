import {ForwardedRef, forwardRef, ReactNode} from 'react';
import {Meta} from './types';
import {cn} from "@/lib/utils";

export interface InputWrapperProps {
    children: ReactNode;
    childrenClassName?: string;
    label?: string | ReactNode;
    labelPosition?: 'top' | 'left' | 'right';
    labelClassName?: string;
    loading?: boolean;
    meta?: Meta;
    name: string;
    wrapperClassName?: string;
}

const SHARED_CLASSES = 'relative items-center justify-center';

export const InputWrapper = forwardRef((props: InputWrapperProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {
        children,
        childrenClassName,
        labelClassName,
        label,
        labelPosition = 'top',
        loading,
        meta,
        name,
        wrapperClassName,
    } = props;

    if (typeof label === 'undefined') {
        return <>{children}</>;
    }

    const top = labelPosition === 'top';
    const left = labelPosition === 'left';
    const right = labelPosition === 'right';

    const {touched, error} = meta || {};

    return (
        <div
            className={cn(
                `${right || left ? 'flex' : 'flex flex-col'}`,
                SHARED_CLASSES,
                top ? 'items-start' : 'items-center',
                wrapperClassName,
            )}
            ref={ref}
        >
            {(left || top) && (
                <label
                    className={cn(
                        'text-sm font-medium leading-6 text-primary',
                        labelClassName,
                        touched && error ? 'text-error' : '',
                    )}
                    htmlFor={name}
                >
                    {label}
                </label>
            )}
            <div
                className={cn(
                    `relative w-full ${label ? (top ? 'pt-1' : left ? 'pl-2' : 'pr-2') : ''}`,
                    childrenClassName,
                )}
            >
                {children}
                {loading && (
                    <div className="absolute right-0 top-0 bottom-1.5 flex items-end pr-4">
                        loading
                    </div>
                )}
            </div>
            {right && (
                <label className={labelClassName} htmlFor={name}>
                    {label}
                </label>
            )}
            {top && touched && error && <div className="text-error text-xs mt-1">{error}</div>}
        </div>
    );
});

InputWrapper.displayName = 'InputWrapper';