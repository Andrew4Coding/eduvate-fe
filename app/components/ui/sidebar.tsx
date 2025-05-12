import { Laptop2, LayoutGrid } from "lucide-react";
import { SimpleTooltip } from "./tooltip";
import { motion } from "framer-motion";
import { Link } from "react-router";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "~/components/ui/avatar";


const features: {
    name: string;
    icon: React.JSX.Element;
    path: string;
}[] = [
        {
            name: "Home",
            icon: <LayoutGrid />,
            path: "/"
        },
        {
            name: "Course",
            icon: <Laptop2 />,
            path: "/dashboard/courses"
        }
    ]
export default function Sidebar() {
    return (
        <motion.div
            initial={{ x: -200 }}
            animate={{ x: 0 }}
            exit={{ x: -200 }}
            transition={{ duration: 0.5 }}
            className="p-8 rounded-r-4xl bg-gray-100 left-0 h-[90%] shadow-2xl flex-col items-center gap-8 z-50 hidden md:flex">
            <img
                src="/eduvate-icon.png"
                width={52}
            />
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
                                <button className="bg-violet-100 hover:bg-violet-200 p-4 rounded-2xl transition-all duration-300 ease-in-out text-black cursor-pointer" key={feature.name}>
                                    <div className="flex flex-col items-center gap-2">
                                        {feature.icon}
                                    </div>
                                </button>
                            </Link>
                        </SimpleTooltip>
                    ))
                }
            </div>

            <Link
                to={"/profile"}
            >
                <Avatar
                    className="w-10 h-10"
                >
                    <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
            </Link>


        </motion.div>
    )
}