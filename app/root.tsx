import {
  data,
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  type LoaderFunctionArgs,
} from "react-router";

import jwt from 'jsonwebtoken';
import { Toaster } from "sonner";
import type { Route } from "./+types/root";
import "./app.css";
import { getUser } from "./lib/auth-client";
import { commitSession, getSession } from "./lib/server/flash";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap",
  },
];

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Eduvate" },
    { name: "description", content: "Eduvate" },
  ];
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export async function loader(args: LoaderFunctionArgs) {
  const user = await getUser(args.request);

  const ticket = jwt.sign(user ?? {}, process.env.JWT_SECRET as string)

  const session = await getSession(args.request.headers.get('Cookie'));

  if (session.get('ticket')) {
    console.log(session.get('ticket'));
    
    return data({
      backendUrl: process.env.BACKEND_URL,
    });
  }

  session.set('ticket', ticket);

  return data(
    {
      headers: {
        'Set-Cookie': await commitSession(session),
      },
    }
  );
}

export default function App() {
  return <>
    <Outlet />
    <Toaster />
  </>;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto" suppressContentEditableWarning suppressHydrationWarning>
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
