import type {HTMLAttributes} from "react";

export const MenuIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => {
    return (<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" {...props}>
        <g fill="none" stroke="#ffffff" strokeDasharray="16" strokeDashoffset="16" strokeLinecap="round"
           strokeLinejoin="round" strokeWidth="2">
            <path d="M5 5h14">
                <animate fill="freeze" attributeName="stroke-dashoffset" dur="0.2s" values="16;0"/>
            </path>
            <path d="M5 12h14">
                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.2s" dur="0.2s" values="16;0"/>
            </path>
            <path d="M5 19h14">
                <animate fill="freeze" attributeName="stroke-dashoffset" begin="0.4s" dur="0.2s" values="16;0"/>
            </path>
        </g>
    </svg>);
};
