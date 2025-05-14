import jwt from 'jsonwebtoken';
import type { ActionFunction, LoaderFunction } from 'react-router';
import { getUser } from '~/lib/auth-client';
// Handle GET requests
export const loader: LoaderFunction = async ({ request }) => {
    const user = await getUser(request);
    
    const ticket = jwt.sign(user ?? {}, process.env.JWT_SECRET as string)
    
    const cookieHeader = request.headers.get('Cookie') || '';

    const url = new URL(request.url);

    const path = `${url.pathname}${url.search}`; // Preserve search params

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
    const user = await getUser(request);

    const ticket = jwt.sign(user ?? {}, process.env.JWT_SECRET as string)

    const url = new URL(request.url);
    let body = undefined;
    if (request.method !== 'GET') {
        try {
            body = await request.json();
        } catch { }
    }

    const cookieHeader = request.headers.get('Cookie') || '';

    const path = url.pathname;
    
    const headers = new Headers({
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Cookie: cookieHeader || '', // Include the cookie header in the request
        Authorization: `Bearer ${ticket || ''}`,
        referer: request.headers.get('referer') || '', // Include the referer header
    });

    console.log(headers);

    const realApiResponse = await fetch(`${process.env.BACKEND_URL}${path}`, {
        method: request.method,
        headers: headers,
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
