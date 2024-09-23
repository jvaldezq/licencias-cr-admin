import {ReactNode} from "react"
import {
    Dialog as CnDialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from "@/components/ui/dialog"

interface Props {
    trigger: ReactNode;
    footer?: ReactNode;
    children?: ReactNode;
    title?: string;
    description?: string;
}

export function Dialog(props: Props) {
    const {trigger, title, description, footer, children} = props;
    return (<CnDialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogDescription>
                        {description}
                    </DialogDescription>
                </DialogHeader>
                {children}
                <DialogFooter className="flex gap-4">
                    <DialogClose>Cancelar</DialogClose>
                    <DialogClose>{footer}</DialogClose>
                </DialogFooter>
            </DialogContent>
        </CnDialog>)
}
