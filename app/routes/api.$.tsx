import type { ActionFunction, LoaderFunction } from 'react-router';
import { getSession } from '~/lib/server/flash';

// Handle GET requests
export const loader: LoaderFunction = async ({ request }) => {
    const cookieHeader = request.headers.get('Cookie') || '';

    const url = new URL(request.url);

    const path = `${url.pathname}${url.search}`; // Preserve search params

    const session = await getSession(cookieHeader);
    const ticket = session.get('ticket');

    const realApiResponse = await fetch(`${process.env.BACKEND_URL}${path}`, {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Cookie: cookieHeader || '', // Include the cookie header in the request
            Authorization: `Bearer ${ticket || ''}`,
            referer: request.headers.get('referer') || '', // Include the referer header
            ...request.headers,
        },
        credentials: 'include',
    });

    const data = await realApiResponse.json();

    if (!realApiResponse.ok) {
        console.log('Failed to fetch data from real API:', realApiResponse.status);

        throw new Response(
            JSON.stringify({
                error: true,
                message: data.message || 'Failed to fetch data',
                status: realApiResponse.status,
            }),
            {
                status: realApiResponse.status,
            }
        );
    }

    return new Response(JSON.stringify(data), {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });
};

// Handle POST, PUT, DELETE, etc.
export const action: ActionFunction = async ({ request }) => {
    const url = new URL(request.url);
    const body = await request.json();

    const cookieHeader = request.headers.get('Cookie') || '';

    const path = url.pathname;

    const session = await getSession(cookieHeader);
    const ticket = session.get('ticket');

    const backendUrl = process.env.BACKEND_URL;

    const realApiResponse = await fetch(`${backendUrl}${path}`, {
        method: request.method,
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Cookie: cookieHeader || '', // Include the cookie header in the request
            Authorization: `Bearer ${ticket || ''}`,
            referer: request.headers.get('referer') || '', // Include the referer header
            ...Object.fromEntries(request.headers.entries()),
        },
        credentials: 'include',
        body: request.method !== 'GET' ? JSON.stringify(body) : null,
    });

    const responseData = await realApiResponse.json();

    if (!realApiResponse.ok) {
        return new Response(
            JSON.stringify({
                error: true,
                message: responseData.message || 'Failed to fetch data',
                status: realApiResponse.status,
            }),
            {
                status: realApiResponse.status,
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
            }
        );
    }

    return new Response(JSON.stringify(responseData), {
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
    });
};
