import {Loader} from "@/components/Loader";

export const FormSavingLoader = ({message}: { message: string }) => {
    return <div className="flex flex-col gap-4 justify-center items-center py-4">
        <Loader/>
        <p className="text-sm">{message}</p>
    </div>
}