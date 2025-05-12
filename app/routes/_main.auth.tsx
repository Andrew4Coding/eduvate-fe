import { Outlet } from "react-router";

export default function AuthPageLayout() {
    return (
        <>
            <div className="w-full h-screen flex items-center justify-center">
                <Outlet />
            </div>
        </>
    )
}