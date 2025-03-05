'use client';

import {
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  useCallback,
} from 'react';
import { CombinedInputProps } from '../types';
import { InputWrapper, InputWrapperProps } from '../InputWrapper';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FormInputProps
  extends CombinedInputProps<string>,
    Omit<InputWrapperProps, 'children'>,
    Omit<InputHTMLAttributes<HTMLDivElement>, 'label' | 'name' | 'onChange'> {
  options: {
    name: string;
    id: string;
  }[];
  onFilter?: (value: string, key: string) => void;
}

export const FormRadioBox = forwardRef(
  (props: FormInputProps, ref: ForwardedRef<HTMLDivElement>) => {
    const {
      label,
      labelClassName,
      labelPosition,
      loading,
      name,
      meta,
      wrapperClassName,
      childrenClassName,
      hidden = false,
      input,
      options,
      className,
      onFilter,
      required,
    } = props;
    const { onChange, value } = input;

    const handleClick = useCallback(
      (option: string) => {
        onChange(option);
        onFilter?.(option, name);
      },
      [name, onChange, onFilter],
    );

    if (hidden) return null;

    return (
      <InputWrapper
        name={name}
        label={label}
        labelClassName={labelClassName}
        labelPosition={labelPosition}
        loading={loading}
        wrapperClassName={wrapperClassName}
        childrenClassName={childrenClassName}
        meta={meta}
        required={required}
      >
        <div
          className={cn(
            'flex',
            'gap-2',
            'flex-wrap',
            'justify-center',
            'items-center',
            'pt-1',
            className,
          )}
          ref={ref}
        >
          {options?.map((option) => {
            return (
              <Button
                variant={value === option.id ? 'default' : 'outline'}
                onClick={() => handleClick(option.id)}
                key={option.id}
                type="button"
              >
                {option.name}
              </Button>
            );
          })}
        </div>
      </InputWrapper>
    );
  },
);

FormRadioBox.displayName = 'FormRadioBox';
