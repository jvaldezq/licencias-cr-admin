'use client';

import {useCallback, useState} from "react";
import {Button} from "@/components/ui/button";
import {Dialog} from "@/components/Dialog";
import * as React from "react";
import {useDeleteMutation} from "@/app/locations/services/client";
import {useRouter} from "next/navigation";
import {FormSavingLoader} from "@/components/FormLoader";
import {DeleteIcon} from "@/assets/icons/DeleteIcon";

export const DeleteLocation = ({id}: { id: number }) => {
    const [open, setOpen] = useState(false);
    const {mutateAsync, isLoading} = useDeleteMutation();
    const router = useRouter();

    const onDelete = useCallback(() => {
        mutateAsync(Number(id)).then(() => {
            setOpen(false);
            router.refresh();
        });
    }, [id]);

    return (<Dialog
        open={open}
        onOpenChange={setOpen}
        title="Eliminar Sede"
        isLoading={isLoading}
        loadingContent={<FormSavingLoader message="Eliminando Sede"/>}
        footer={<Button
            onClick={onDelete}
            className="bg-secondary text-white rounded-3xl animate-fade-right animate-once animate-duration-500 animate-delay-100 animate-ease-in">Eliminar</Button>}
        trigger={<Button variant="outline"><DeleteIcon/></Button>}>
        {isLoading ? null :
            <p className="text-primary text-base font-medium">Está seguro que desea eliminar la Sede</p>}
    </Dialog>)
}