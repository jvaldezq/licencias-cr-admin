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
  cancelText?: string;
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
    cancelText = 'Cancelar',
  } = props;
  return (
    <CnDialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild is="div">
        {trigger}
      </DialogTrigger>
      <DialogContent
        className="max-h-full overflow-scroll p-3.5"
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
              {cancelText}
            </Button>
            {footer}
          </DialogFooter>
        )}
      </DialogContent>
    </CnDialog>
  );
};
