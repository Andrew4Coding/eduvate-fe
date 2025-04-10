import { Outlet, redirect, type LoaderFunctionArgs } from "react-router";
import VoiceIndicator from "~/components/elements/VoiceIndicator";
import Sidebar from "~/components/ui/sidebar";
import { KeyPressProvider } from "~/hooks/useSpacePress";
import { authClient } from "~/lib/auth-client";

export async function loader(args: LoaderFunctionArgs) {
    console.log(args.request.headers.get('Cookie'));
    
    const session = await authClient.getSession({
        fetchOptions: {
            headers: {
                Cookie: args.request.headers.get('Cookie') || '',
            }
        }
    })

    console.log('session', session);

    if (!session.data) {
        return redirect('/auth')
    }

    return session;
}

export default function Index() {
    return (
        <main className="font-jakarta font-medium flex gap-10 h-screen items-center relative">
            <KeyPressProvider>
                <Sidebar />
                <div className="h-full w-full relative">
                    <Outlet />
                    <VoiceIndicator />
                </div>
            </KeyPressProvider>
        </main>
    )
}