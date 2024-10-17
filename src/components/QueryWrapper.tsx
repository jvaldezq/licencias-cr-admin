'use client';

import {QueryCache, QueryClient, QueryClientProvider} from "react-query";
import * as React from "react";
import {ReactNode, useMemo} from "react";

interface Props { children?: ReactNode }

export function QueryWrapper({children}: Props) {
    const queryClient = useMemo(
        () =>
            new QueryClient({
                queryCache: new QueryCache({
                    onError: (error) => {
                        console.error('Error:', error);
                    },
                }),
            }),
        []
    );


    return <QueryClientProvider client={queryClient}>
        {children}
    </QueryClientProvider>
}