import prisma from "prisma/prisma";
import { redirect, type LoaderFunctionArgs } from "react-router";
import MaterialModule from "~/modules/MaterialModule";

export async function loader(args: LoaderFunctionArgs) {
    const params = args.params;
    const id = params.id as string;

    const materials = await prisma.material.findFirst({
        where: {
            courseItemId: id
        },
        include: {
            courseItem: true
        }
    })


    if (!materials) {
        return redirect("/dashboard/courses");
    }

    return materials;
}

export default function Index() {
    return <MaterialModule />
}