import {
  Popover as CnPopover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { ReactNode } from 'react';

interface TooltipProps {
  children: ReactNode;
  text: string;
}

export const Popover = ({ children, text }: TooltipProps) => {
  return (
    <CnPopover>
      <PopoverTrigger>{children}</PopoverTrigger>
      <PopoverContent>{text}</PopoverContent>
    </CnPopover>
  );
};
