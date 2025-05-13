import { Laptop2, LayoutGrid } from "lucide-react";
import { Link } from "react-router";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "~/components/ui/avatar";
import { SimpleTooltip } from "~/components/ui/tooltip";

const features: {
name: string;
icon: React.JSX.Element;
path: string;
}[] = [
{
    name: "Home",
    icon: <LayoutGrid size={24}/>,
    path: "/",
},
{
    name: "Course",
    icon: <Laptop2 size={24}/>,
    path: "/dashboard/courses",
},
];

export default function Navbar() {
return (
    <nav
        className="fixed bottom-0 z-50 w-full bg-white shadow-md flex items-center justify-between p-8 md:hidden rounded-t-3xl"
    >
        <img src="/eduvate-icon.png" width={52} alt="Eduvate Icon" />

        <div className="flex items-center gap-8">
            {features.map((feature) => (
                <SimpleTooltip
                    key={feature.name}
                    content={feature.name}
                    side="bottom"
                >
                    <Link to={feature.path}>
                        <button className="bg-violet-100 hover:bg-violet-200 p-4 rounded-full transition-all duration-300 ease-in-out text-black cursor-pointer">
                            {feature.icon}
                        </button>
                    </Link>
                </SimpleTooltip>
            ))}
        </div>

        <Link to={"/profile"}>
            <Avatar className="w-10 h-10">
                <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        </Link>
    </nav>
);
}