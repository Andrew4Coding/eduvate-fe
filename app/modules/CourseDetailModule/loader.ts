import prisma from "prisma/prisma";
import { redirect, type LoaderFunctionArgs } from "react-router";

export default async function courseDetailLoader(args: LoaderFunctionArgs) {
    const id = args.params.id;

    const course = await prisma.course.findUnique({
        where: {
            id: id,
        },
        include: {
            CourseSection: {
                include: {
                    CourseItem: {
                        include: {
                            Material: true,
                            Quiz: true,
                            Task: true
                        }
                    }
                }
            }
        }
    })

    if (!course) {
        return redirect('/404');
    }

    return course;
}