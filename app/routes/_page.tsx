import { Outlet } from "react-router";
import Sidebar from "~/components/ui/sidebar";

export default function Index() {
    return (
        <main className="font-jakarta font-medium">
            <Sidebar />
            <Outlet />
        </main>
    )
}