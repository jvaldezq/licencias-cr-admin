import { ReactNode } from 'react';
import {
  Dialog as CnDialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import * as React from 'react';

interface Props {
  trigger: ReactNode;
  footer?: ReactNode;
  children?: ReactNode;
  title?: string;
  description?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  isLoading?: boolean;
  loadingContent?: ReactNode;
}

export const Dialog = (props: Props) => {
  const {
    trigger,
    title,
    description,
    footer,
    children,
    open,
    onOpenChange,
    isLoading = false,
    loadingContent,
  } = props;
  return (
    <CnDialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild is="div">
        {trigger}
      </DialogTrigger>
      <DialogContent
        className="max-h-full overflow-scroll"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {isLoading && loadingContent}
        {children}
        {!isLoading && (
          <DialogFooter className="flex gap-4" is="div">
            <Button
              className="w-full md:w-fit rounded-3xl"
              variant="outline"
              onClick={() => (onOpenChange ? onOpenChange(false) : null)}
            >
              Cancelar
            </Button>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </CnDialog>
  );
};
