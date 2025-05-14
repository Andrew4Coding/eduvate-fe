import prisma from "prisma/prisma";
import { redirect, type LoaderFunctionArgs } from "react-router";
import { getUser } from "~/lib/auth-client";

export async function dashboardTeacherLoader(args: LoaderFunctionArgs) {
    const user = await getUser(args.request);

    if (!user || user.role !== "teacher") {
        return redirect("/auth/login");
    }

    const [studentsData] = await Promise.all([
        await prisma.course.findMany({
            where: {
                teachers: {
                    some: {
                        userId: user.id
                    }
                }
            },
            include: {
                students: {
                    include: {
                        user: true
                    }
                }
            }
        })
    ])

    return {
        studentsData
    }
}