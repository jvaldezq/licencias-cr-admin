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
import { CombinedInputProps } from '../types';
import { InputWrapper, InputWrapperProps } from '../InputWrapper';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';

export interface FormInputProps
  extends CombinedInputProps<string>,
    Omit<InputWrapperProps, 'children'>,
    Omit<InputHTMLAttributes<HTMLInputElement>, 'label' | 'name' | 'onChange'> {
  icon?: JSX.Element;
  maskType?: string;
  hidden?: boolean;
  onFilter?: (value: string) => void;
}

const MASKS: Record<string, string | object> = {
  number: {
    mask: Number,
    scale: 0,
    signed: false,
    padFractionalZeros: false,
    normalizeZeros: true,
    radix: '.',
    mapToRadix: ['.'],
    min: 0,
  },
};

export const FormInput = forwardRef(
  (props: FormInputProps, ref: ForwardedRef<HTMLInputElement>) => {
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
      maskType,
      hidden = false,
      onFilter,
      required,
      ...rest
    } = props;
    const { onChange, value, ...inputRest } = input;
    const myRef = useRef<HTMLInputElement | null>(null);

    // useEffect(() => {
    //   if (myRef?.current) {
    //     if (mask) {
    //       IMask(
    //         myRef.current,
    //         typeof mask === 'string' ? { mask: mask } : mask,
    //       );
    //     }
    //   }
    // }, [mask, hidden]);

    useEffect(() => {
      if (myRef?.current) {
        if (!maskType) {
          return;
        }
        const maskPattern = MASKS[maskType!];
        if (maskPattern) {
          IMask(
            myRef.current,
            typeof maskPattern === 'string'
              ? { mask: maskPattern }
              : maskPattern,
          );
        }
      }
    }, [maskType]);

    const myOnChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value);
        onFilter?.(e.target.value);
      },
      [onChange, onFilter],
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
        <Input
          name={name}
          className={cn(className, value ? 'bg-success/[0.05]' : undefined)}
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
      </InputWrapper>
    );
  },
);

FormInput.displayName = 'FormInput';
