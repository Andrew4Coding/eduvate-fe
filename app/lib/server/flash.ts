import { createCookieSessionStorage } from 'react-router';
import dotenv from 'dotenv';

dotenv.config();

let secret = process.env.COOKIE_SECRET || 'default';
if (secret === 'default') {
    console.warn(
        '🚨 No COOKIE_SECRET environment variable set, using default. The app is insecure in production.'
    );
    secret = 'default-secret';
}

type SessionData = {
    __session: string;
    'better-auth.session_token': string;
    'better-auth.dont_remember': string;
    ticket: string;
};

type SessionFlashData = {
    error: string;
};

const { getSession, commitSession, destroySession } =
    createCookieSessionStorage<SessionData, SessionFlashData>({
        cookie: {
            name: '__session',
            httpOnly: true,
            maxAge: 60 * 60 * 24,
            sameSite: 'lax',
            secrets: [secret],
            secure: process.env.NODE_ENV === 'production',
        },
    });

export { commitSession, destroySession, getSession };
