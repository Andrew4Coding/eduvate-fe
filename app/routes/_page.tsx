import { Outlet, redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import VoiceIndicator from "~/components/elements/VoiceIndicator";
import Sidebar from "~/components/ui/sidebar";
import { KeyPressProvider } from "~/hooks/useSpacePress";
import { getUser, type userData } from "~/lib/auth-client";

export async function loader(args: LoaderFunctionArgs) {
    const user = await getUser(args.request);

    if (!user) {
        return redirect("/auth/login");
    }

    return user;
}

export default function Index() {
    const user: userData = useLoaderData<typeof loader>();
    
    return (
        <main className="font-jakarta font-medium flex gap-10 h-screen items-center relative">
            <KeyPressProvider>
                <Sidebar />
                <div className="h-full w-full relative">
                    <Outlet
                        context={user}
                    />
                    <VoiceIndicator />
                </div>
            </KeyPressProvider>
        </main>
    )
}