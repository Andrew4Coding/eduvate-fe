import { motion } from "framer-motion";
import { Laptop2, LayoutGrid, LogOut, Paperclip } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";
import { SimpleTooltip } from "./tooltip";

import { authClient } from "~/lib/auth-client";


enum ROLE {
    STUDENT,
    TEACHER
}

const features: {
    name: string;
    icon: React.JSX.Element;
    path: string;
    role?: ROLE[]
}[] = [
        {
            name: "Home",
            icon: <LayoutGrid />,
            path: "/dashboard"
        },
        {
            name: "Course",
            icon: <Laptop2 />,
            path: "/dashboard/courses"
        },
        {
            name: "Quiz",
            icon: <Paperclip />,
            path: "/dashboard/quizzes",
            role: [ROLE.TEACHER]
        }
    ]
export default function Sidebar() {
    const path = useLocation().pathname;
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            exit={{ x: -200 }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-r-4xl bg-gray-100 left-0 h-[90%] shadow-2xl flex-col items-center gap-8 z-50 hidden md:flex fixed">
            <Link to={'/'}>
                <img
                    src="/eduvate-icon.png"
                    width={52}
                />
            </Link>
            <div className="grow flex flex-col items-center gap-8">
                {
                    features.map((feature) => (
                        <SimpleTooltip
                            key={feature.name}
                            content={feature.name}
                            side="right"
                        >
                            <Link
                                to={feature.path}
                            >
                                <button
                                    className={`p-4 rounded-2xl transition-all duration-300 ease-in-out text-black cursor-pointer ${path === feature.path ? "bg-violet-500 text-white" : "bg-violet-100 hover:bg-violet-200"
                                        }`}
                                    key={feature.name}
                                >
                                    <div className="flex flex-col items-center gap-2">
                                        {feature.icon}
                                    </div>
                                </button>
                            </Link>
                        </SimpleTooltip>
                    ))
                }
            </div>

            <div className="flex flex-col items-center gap-8">
                <SimpleTooltip
                    content={'Logout'}
                    side="right"
                >
                    <button
                        className={`p-4 rounded-2xl transition-all duration-300 ease-in-out text-black cursor-pointer ${path === '/logout' ? "bg-violet-500 text-white" : "bg-violet-100 hover:bg-violet-200"}`}
                        onClick={async () => {
                            await authClient.signOut({
                                fetchOptions: {
                                    onSuccess: () => {
                                        navigate('/logout')
                                    },
                                },
                            });
                        }}
                    >
                        <div className="flex flex-col items-center gap-2">
                            <LogOut />
                        </div>
                    </button>
                </SimpleTooltip>
            </div>



        </motion.div>
    )
}