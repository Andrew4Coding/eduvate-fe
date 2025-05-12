import prisma from "prisma/prisma";
import type { LoaderFunctionArgs } from "react-router";
import { getUser } from "~/lib/auth-client";

export default async function coursesLoader(args: LoaderFunctionArgs) {
    const user = await getUser(args.request);

    let courses;

    if (user?.role === 'teacher') {
        courses = await prisma.course.findMany({
            where: {
                teachers: {
                    some: {
                        userId: user?.id,
                    },
                }
            },
        });
    } else {
        courses = await prisma.course.findMany({
            where: {
                students: {
                    some: {
                        userId: user?.id,
                    },
                },
            },
        });
    }
    
    return courses;
}