type fetchResponse = {
    status: number;
    statusText: string;
    data: any;
}

export const fetchClient = async (path: string, options: RequestInit = {}): Promise<fetchResponse> => {
    const response = await fetch(path, {
        ...options,
        headers: {
            ...options.headers,
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            Cookie: document.cookie,
        },
        credentials: 'include',
    });

    try {
        const data = await response.json();
        return {
            status: response.status,
            statusText: response.statusText,
            data,
        };
    }
    catch (error) {
        return {
            status: response.status,
            statusText: response.statusText,
            data: null,
        };
    }
}