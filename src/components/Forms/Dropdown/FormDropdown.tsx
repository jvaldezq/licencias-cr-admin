import {ForwardedRef, forwardRef, InputHTMLAttributes, ReactNode, useState} from "react";
import {InputWrapper, InputWrapperProps} from "@/components/Forms/InputWrapper";
import {CombinedInputProps} from "@/components/Forms/types";
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList,} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {Button} from "@/components/ui/button";
import {useMediaQuery} from "@/hooks/use-media-query";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import {InputLoader} from "@/components/InputLoader";
import {cn} from "@/lib/utils";

interface IProps extends CombinedInputProps<string>, Omit<InputWrapperProps, 'children'>, Omit<InputHTMLAttributes<HTMLInputElement>, 'label' | 'name' | 'onChange'> {
    options: {
        name: string; id: string
    }[];
    isLoading?: boolean;
    disabled?: boolean;
    onFilter?: (value: string, key: string) => void;
    secondaryAction?: ReactNode;
    hidden?: boolean;
}

export const FormDropdown = forwardRef((props: IProps, ref: ForwardedRef<HTMLInputElement>) => {
    const {
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
        isLoading,
        disabled,
        onFilter,
        secondaryAction,
        hidden = false,
    } = props;
    const [open, setOpen] = useState(false)
    const {onChange, value} = input;
    const isDesktop = useMediaQuery("(min-width: 768px)")
    const valueLabel = options?.find(option => option?.id == value)?.name

    if (hidden) return null;
    if (isLoading) return <InputLoader />;

    return <InputWrapper
        name={name}
        label={label}
        labelClassName={labelClassName}
        labelPosition={labelPosition}
        loading={loading}
        wrapperClassName={wrapperClassName}
        childrenClassName={childrenClassName}
        meta={meta}>
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button disabled={disabled} variant="outline"
                        className={
                    cn('w-full',
                        'justify-between',
                        'text-tertiary',
                        'text-xs',
                            valueLabel ? 'bg-success/[0.1]' : undefined
                    )
                        }>
                    {valueLabel ? valueLabel : placeholder}
                    {secondaryAction}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="p-0" align="start">
                <Command>
                    <CommandInput placeholder="Estado del filtro..." ref={ref}/>
                    <CommandList>
                        <CommandEmpty
                            className='flex justify-center items-center gap-2 py-2 text-sm text-tertiary'>Sin
                            resultados</CommandEmpty>
                        <CommandGroup>
                            {options?.map((option) => (<CommandItem
                                className="cursor-pointer"
                                key={option.id}
                                value={option.name}
                                onSelect={() => {
                                    onChange(option.id);
                                    setOpen(false);
                                    onFilter && onFilter(option.id, name);
                                }}
                            >
                                {option.name}
                            </CommandItem>))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
        {/*{isDesktop ? <Popover open={open} onOpenChange={setOpen}>*/}
        {/*    <PopoverTrigger asChild>*/}
        {/*        <Button disabled={disabled} variant="outline"*/}
        {/*                className="w-full justify-between text-tertiary text-xs">*/}
        {/*            {valueLabel ? valueLabel : placeholder}*/}
        {/*            {secondaryAction}*/}
        {/*        </Button>*/}
        {/*    </PopoverTrigger>*/}
        {/*    <PopoverContent className="w-fit p-0" align="start">*/}
        {/*        <Command>*/}
        {/*            <CommandInput placeholder="Estado del filtro..." ref={ref}/>*/}
        {/*            <CommandList>*/}
        {/*                <CommandEmpty*/}
        {/*                    className='flex justify-center items-center gap-2 py-2 text-sm text-tertiary'>Sin*/}
        {/*                    resultados</CommandEmpty>*/}
        {/*                <CommandGroup>*/}
        {/*                    {options?.map((option) => (<CommandItem*/}
        {/*                        className="cursor-pointer"*/}
        {/*                        key={option.id}*/}
        {/*                        value={option.name}*/}
        {/*                        onSelect={() => {*/}
        {/*                            onChange(option.id);*/}
        {/*                            setOpen(false);*/}
        {/*                            onFilter && onFilter(option.id, name);*/}
        {/*                        }}*/}
        {/*                    >*/}
        {/*                        {option.name}*/}
        {/*                    </CommandItem>))}*/}
        {/*                </CommandGroup>*/}
        {/*            </CommandList>*/}
        {/*        </Command>*/}
        {/*    </PopoverContent>*/}
        {/*</Popover> : <Drawer open={open} onOpenChange={setOpen} fadeFromIndex={undefined} snapPoints={undefined}>*/}
        {/*    <DrawerTrigger asChild>*/}
        {/*        <Button disabled={disabled} variant="outline"*/}
        {/*                className="w-full justify-between text-tertiary text-xs">*/}
        {/*            {valueLabel ? valueLabel : placeholder}*/}
        {/*            {secondaryAction}*/}
        {/*        </Button>*/}
        {/*    </DrawerTrigger>*/}
        {/*    <DrawerContent>*/}
        {/*        <DrawerHeader>*/}
        {/*            <DrawerTitle>{placeholder}</DrawerTitle>*/}
        {/*            <DrawerDescription>{valueLabel}</DrawerDescription>*/}
        {/*        </DrawerHeader>*/}
        {/*            <Command>*/}
        {/*                <CommandInput placeholder="Estado del filtro..." ref={ref}/>*/}
        {/*                <CommandList>*/}
        {/*                    <CommandEmpty*/}
        {/*                        className='flex justify-center items-center gap-2 py-2 text-sm text-tertiary'>Sin*/}
        {/*                        resultados</CommandEmpty>*/}
        {/*                    <CommandGroup>*/}
        {/*                        {options?.map((option) => (<CommandItem*/}
        {/*                            key={option.id}*/}
        {/*                            value={option.name}*/}
        {/*                            onSelect={() => {*/}
        {/*                                onChange(option.id);*/}
        {/*                                setOpen(false);*/}
        {/*                                onFilter && onFilter(option.id, name);*/}
        {/*                            }}*/}
        {/*                        >*/}
        {/*                            {option.name}*/}
        {/*                        </CommandItem>))}*/}
        {/*                    </CommandGroup>*/}
        {/*                </CommandList>*/}
        {/*            </Command>*/}
        {/*    </DrawerContent>*/}
        {/*</Drawer>}*/}
    </InputWrapper>
});

FormDropdown.displayName = 'FormDropdown';