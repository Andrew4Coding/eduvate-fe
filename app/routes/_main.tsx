import { Grid } from "lucide-react";
import { Link, Outlet, useLoaderData, type LoaderFunctionArgs } from "react-router";
import Footer from "~/components/elements/Footer";
import { Button } from "~/components/ui/button";
import { getUser } from "~/lib/auth-client";

export async function loader(args: LoaderFunctionArgs) {
    const user = await getUser(args.request);

    return user ?? null;
}

export default function MainModuleLayout() {
    const user = useLoaderData<typeof loader>();
    return (
        <main className="max-w-[1920px] mx-auto relative border-2 min-h-screen">
            <img src="/home-bg.png" alt="" className="fixed w-screen h-screen -z-10 object-cover opacity-50" />
            <nav className="w-full sticky top-0 left-0 z-50 border-b bg-white">
                <div className="max-w-[1920px] mx-auto px-10 md:px-20 flex h-16 items-center justify-between">
                    <Link
                        to={'/'}
                    >
                        <div className="flex items-center gap-2 cursor-pointer">
                            <img
                                src="/eduvate-icon.png"
                                alt="EduVate Logo"
                                className="h-8 w-8 rounded-full"
                            />
                            <span className="text-xl font-bold text-purple-500">EduVate</span>
                        </div>
                    </Link>
                    <div className="flex items-center gap-4">
                        {user ? (
                            <Link
                                to={'dashboard'}
                            >
                                <Button className="hidden md:flex">
                                    <Grid />
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link
                                to={'auth'}
                            >
                                <Button className="hidden md:flex">
                                    Log in
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
            <Outlet />
            <Footer />
        </main>
    )
}