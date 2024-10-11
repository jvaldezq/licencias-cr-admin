import {Skeleton} from "@/components/ui/skeleton";

export function TableSkeleton() {
    return <div className="flex flex-col w-full">
            <div className="flex flex-col gap-2">
                <Skeleton className="h-6 w-full"/>
                <Skeleton className="h-6 w-full"/>
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