import {ReactNode} from "react"
import {
    Dialog as CnDialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button";
import * as React from "react";

interface Props {
    trigger: ReactNode;
    footer?: ReactNode;
    children?: ReactNode;
    title?: string;
    description?: string;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function Dialog(props: Props) {
    const {trigger, title, description, footer, children, open, onOpenChange} = props;
    return (<CnDialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>
            {trigger}
        </DialogTrigger>
        <DialogContent className="w-full h-full md:h-auto overflow-y-scroll">
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                    {description}
                </DialogDescription>
            </DialogHeader>
            {children}
            <DialogFooter className="flex gap-4">
                <DialogClose>
                    <Button
                        className="w-full rounded-3xl"
                        variant="outline"
                    >
                        Cancelar
                    </Button>
                </DialogClose>
                {footer}
            </DialogFooter>
        </DialogContent>
    </CnDialog>)
}
