import { Outlet, redirect, useLoaderData, type LoaderFunctionArgs } from "react-router";
import Navbar from "~/components/elements/Navbar";
import VoiceIndicator from "~/components/elements/VoiceIndicator";
import Sidebar from "~/components/ui/sidebar";
import { KeyPressProvider } from "~/hooks/useKeyPress";
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
        <main className="font-jakarta font-medium flex gap-10 h-screen items-center relative"
            onClick={async () => {}}
        >
            <img src="/home-bg.png" alt="" className="fixed w-screen h-screen z-0 object-cover opacity-60" />
            <KeyPressProvider isStudent={user.role === "student"}>
                <Sidebar />
                <Navbar />
                <div className="h-full w-full relative md:pl-40">
                    <Outlet
                        context={user}
                    />
                    {
                        user.role === "student" && 
                        <VoiceIndicator />
                    }
                </div>
            </KeyPressProvider>
        </main>
    )
}