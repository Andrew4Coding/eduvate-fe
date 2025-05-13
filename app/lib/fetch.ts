type fetchResponse = {
    status: number;
    statusText: string;
    data: any;
}

export const fetchClient = async (path: string, options: RequestInit = {}): Promise<fetchResponse> => {
    // Create a new Headers object, optionally initialized with headers from options
    const requestHeaders = new Headers(options.headers);

    // Set Content-Type and Accept. .set() will overwrite if already present (case-insensitively).
    requestHeaders.set('Content-Type', 'application/json');
    requestHeaders.set('Accept', 'application/json');

    // Preserve the Cookie header logic if it's essential for your current setup,
    // though `credentials: 'include'` is the more standard way for cookies.
    if (document.cookie) { // Check if document.cookie has a value
        requestHeaders.set('Cookie', document.cookie);
    }

    const response = await fetch(path, {
        ...options, // Spread other options like method, body, etc.
        headers: requestHeaders, // Use the managed Headers object
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
        // Handle cases where response.json() might fail (e.g., empty body or non-JSON response)
        return {
            status: response.status,
            statusText: response.statusText,
            data: null, // Or error information, depending on how you want to handle this
        };
    }
}