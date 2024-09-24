interface ServerApiProps {
    path: string;
    params?: any; //TODO NEED TO FIX TYPE
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
    revalidate?: number;
    body?: any;
}

export const serverApi = async (props: ServerApiProps) => {
    try {
        const {path, params, body, method = 'GET', revalidate = 60} = props;
        const parameters = params ? `?${new URLSearchParams(params).toString()}` : '';
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}${parameters}`, {
            method, next: {revalidate}, body: JSON.stringify(body),
        });

        if (!res.ok) {
            console.error(res);
            throw new Error(`Failed to fetch data from ${path}`);
        }

        return await res.json();
    } catch (error) {
        console.error(error);
        return null
    }
};