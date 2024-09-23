import {InputHTMLAttributes, useState} from "react";
import {InputWrapper, InputWrapperProps} from "@/components/Forms/InputWrapper";
import {CombinedInputProps} from "@/components/Forms/types";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {Button} from "@/components/ui/button";
import {useMediaQuery} from "@/hooks/use-media-query";
import {Drawer, DrawerContent, DrawerTrigger} from "@/components/ui/drawer";

interface IProps extends CombinedInputProps<string>, Omit<InputWrapperProps, 'children'>, Omit<InputHTMLAttributes<HTMLInputElement>, 'label' | 'name' | 'onChange'> {
    options: {
        name: string; id: string
    }[];
}

export const Dropdown = (props: IProps) => {
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
        options,
        ...rest
    } = props;
    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState('')
    const {onChange, value} = input;
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const valueLabel = options?.find(option => option?.id === value)?.name

    return <InputWrapper
        name={name}
        label={label}
        labelClassName={labelClassName}
        labelPosition={labelPosition}
        loading={loading}
        wrapperClassName={wrapperClassName}
        childrenClassName={childrenClassName}
        meta={meta}>
        {isDesktop ? <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline"
                        className="w-full justify-start text-tertiary text-xs overflow-hidden">
                    {valueLabel ? valueLabel : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit p-0" align="start">
                <Command>
                    <CommandInput placeholder="Estado del filtro..." onValueChange={setSearch}/>
                    <CommandList>
                        <CommandEmpty
                            className='flex justify-center items-center gap-2 py-2 text-sm text-tertiary'>No se
                            encontraron resultados.</CommandEmpty>
                        <CommandGroup>
                            {options?.map((option) => (<CommandItem
                                key={option.id}
                                value={`${option.id}`}
                                onSelect={(value) => {
                                    onChange(value);
                                    setOpen(false)
                                }}
                            >
                                {option.name}
                            </CommandItem>))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover> : <Drawer open={open} onOpenChange={setOpen} fadeFromIndex={undefined} snapPoints={undefined}>
            <DrawerTrigger asChild>
                <Button variant="outline"
                        className="justify-start w-full text-tertiary text-xs">
                    {valueLabel ? valueLabel : placeholder}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mt-4 border-t">
                    <Command>
                        <CommandInput placeholder="Estado del filtro..." onValueChange={setSearch}/>
                        <CommandList>
                            <CommandEmpty
                                className='flex justify-center items-center gap-2 py-2 text-sm text-tertiary'>No se
                                encontraron resultados.</CommandEmpty>
                            <CommandGroup>
                                {options?.map((option) => (<CommandItem
                                    key={option.id}
                                    value={`${option.id}`}
                                    onSelect={(value) => {
                                        onChange(value);
                                        setOpen(false)
                                    }}
                                >
                                    {option.name}
                                </CommandItem>))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </div>
            </DrawerContent>
        </Drawer>}

    </InputWrapper>
}