import { Outlet } from "react-router";
import VoiceIndicator from "~/components/elements/VoiceIndicator";
import Sidebar from "~/components/ui/sidebar";
import { KeyPressProvider } from "~/hooks/useSpacePress";

export default function Index() {
    return (
        <main className="font-jakarta font-medium flex gap-10 h-screen items-center ">
            <KeyPressProvider>
                <Sidebar />
                <div className="h-full w-full">
                    <Outlet />
                </div>
                <VoiceIndicator />
            </KeyPressProvider>
        </main>
    )
}