import { FocusEvent, KeyboardEvent } from 'react';

export interface CombinedInputProps<T> {
  input: Input<T>;
  meta?: Meta;
}

export interface Input<T> {
  name?: string;
  onBlur?: (event?: FocusEvent<HTMLElement>) => void;
  onChange: (v: T) => void;
  onFocus?: (event?: FocusEvent<HTMLElement>) => void;
  onKeyDown?: (event?: KeyboardEvent<HTMLElement>) => void;
  type?: string;
  value?: T;
  checked?: boolean;
  multiple?: boolean;
}

export interface Meta {
  active?: boolean;
  data?: {
    [key: string]: never;
  };
  dirty?: boolean;
  dirtySinceLastSubmit?: boolean;
  error?: never;
  initial?: never;
  invalid?: boolean;
  length?: number;
  modified?: boolean;
  modifiedSinceLastSubmit?: boolean;
  pristine?: boolean;
  submitError?: never;
  submitFailed?: boolean;
  submitSucceeded?: boolean;
  submitting?: boolean;
  touched?: boolean;
  valid?: boolean;
  validating?: boolean;
  visited?: boolean;
}
