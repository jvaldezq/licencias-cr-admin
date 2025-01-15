import type {HTMLAttributes} from "react";

export const SalesIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48" {...props}>
        <g fill="none" stroke="#383836" strokeLinejoin="round" strokeWidth="4">
            <path d="M41 14L24 4L7 14v20l17 10l17-10z"/>
            <path strokeLinecap="round" d="M24 22v8m8-12v12m-16-4v4"/>
        </g>
    </svg>);
};
