import {Skeleton} from "@/components/ui/skeleton";

export function PageSkeleton() {
    return <div className="flex flex-col w-full">
        <div className="flex justify-between gap-1 mb-10">
            <Skeleton className="h-8 w-[100px]"/>
            <Skeleton className="h-8 w-[100px]"/>
        </div>
            <div className="flex flex-col gap-1">
                <Skeleton className="h-6 w-full"/>
                <Skeleton className="h-6 w-full"/>
                <Skeleton className="h-6 w-full"/>
                <Skeleton className="h-6 w-full"/>
                <Skeleton className="h-6 w-full"/>
                <Skeleton className="h-6 w-full"/>
                <Skeleton className="h-6 w-full"/>
            </div>
        </div>
        }