import {FormEvent, ReactNode} from "react";
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"

interface Props {
    title?: string;
    trigger: ReactNode;
    options: { content: ReactNode, key: string }[]
}

export const Dropdown = (props: Props) => {
    const {trigger, options, title} = props;

    const handleClick = (e: FormEvent) => {
        e.preventDefault();
    }

    return <DropdownMenu key={title}>
        {title && <DropdownMenuLabel>{title}</DropdownMenuLabel>}
        <DropdownMenuTrigger asChild is="div">{trigger}</DropdownMenuTrigger>
        <DropdownMenuContent>
            {options?.map((option) => {
                return <DropdownMenuItem onSelect={(e) => e.preventDefault()}
                                         className="justify-center" key={option?.key}
                                         onClick={handleClick}>{option.content}</DropdownMenuItem>
            })}
        </DropdownMenuContent>
    </DropdownMenu>

}