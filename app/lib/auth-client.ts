import { createAuthClient } from "better-auth/react"
import { customSessionClient } from "better-auth/client/plugins";
import type { auth } from "~/lib/auth"; // Import the auth instance as a type


export const authClient = createAuthClient({
    baseURL: 'http://localhost:3000',
    plugins: [customSessionClient<typeof auth>()],
});

export interface userData {
    role: 'student' | 'teacher' | 'admin';
    id: string;
    name: string;
    email: string;
    emailVerified: boolean;
    createdAt: Date;
    updatedAt: Date;
    image?: string | null | undefined | undefined;
}

export const getUser = async (request: Request): Promise<userData | null> => {
    const session = await authClient.getSession({
        fetchOptions: {
            headers: {
                Cookie: request.headers.get('Cookie') || '',
            },
        }
    })

    const user = session.data?.user;

    if (!user) {
        return null;
    }
    return user as userData;
}