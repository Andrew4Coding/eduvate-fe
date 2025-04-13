import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { fetchClient } from "~/lib/fetch";
import uploadFileClient from "~/lib/file";
const addSectionSchema = z.object({
    name: z.string().min(1, "Section name is required"),
    description: z.string().optional(),
})

const addCourseItemSchema = z.object({
    name: z.string().min(1, "Item name is required"),
    description: z.string().optional(),
    type: z.enum(["MATERIAL", "QUIZ", "TASK"]),
    fileUrl: z.string().optional(),
    file: z.instanceof(File).optional(),
    fileType: z.enum(["PDF", "VIDEO", "AUDIO", "PPT"]).optional(),
    openDate: z.string().optional(),
    dueDate: z.string().optional(),
    closeDate: z.string().optional(),
})

const editCourseSchema = z.object({
    name: z.string().min(1, "Course name is required"),
    description: z.string().optional(),
})

// Mock functions for API calls
const addSection = async (courseId: string, data: z.infer<typeof addSectionSchema>) => {
    const responseData = await fetchClient("/course/section", {
        method: "POST",
        body: JSON.stringify({
            courseId,
            ...data
        })
    })
    
    return { success: true, id: "new-section-id" }
}

const addCourseItem = async (sectionId: string, data: z.infer<typeof addCourseItemSchema>) => {
    console.log(`Adding item to section ${sectionId}:`, data)

    // Upload to s3
    if (data.type === 'MATERIAL') {
        // Upload file into /api/upload
        const url = await uploadFileClient(
            data.file as File,
            data.file!.name,
            data.fileType as string
        )

        const responseData = fetchClient("/material/create", {
            method: "POST",
            body: JSON.stringify({
                courseSectionId: sectionId,
                ...data,
                fileUrl: url.url
            })
        })

        if (!responseData) {
            throw new Error("Failed to upload file")
        }

        return { success: true, id: "new-item-id" }
    }
    else if (data.type === 'QUIZ') {
        const responseData = fetchClient("/quiz/create", {
            method: "POST",
            body: JSON.stringify({
                courseSectionId: sectionId,
                ...data
            })
        })

        if (!responseData) {
            throw new Error("Failed to upload file")
        }

        return { success: true, id: "new-item-id" }
    }

    else if (data.type === 'TASK') {
        const responseData = fetchClient("/task/create", {
            method: "POST",
            body: JSON.stringify({
                courseSectionId: sectionId,
                ...data
            })
        })
        if (!responseData) {
            throw new Error("Failed to upload file")
        }

        return { success: true, id: "new-item-id" }
    }

    return { success: true, id: "new-item-id" }
}

const updateCourse = async (courseId: string, data: z.infer<typeof editCourseSchema>) => {
    const responseData = await fetchClient(`/course/${courseId}`, {
        method: "PUT",
        body: JSON.stringify(data)
    })
    if (!responseData) {
        throw new Error("Failed to update course")
    }
    return { success: true }
}

const deleteSection = async (sectionId: string) => {
    const responseData = await fetchClient(`/course/section/${sectionId}`, {
        method: "DELETE",
    })
    if (!responseData) {
        throw new Error("Failed to delete section")
    }
    return { success: true }
}

const deleteCourseItem = async (itemId: string) => {
    const responseData = await fetchClient(`/course/item/${itemId}`, {
        method: "DELETE",
    })

    if (!responseData) {
        throw new Error("Failed to delete item")
    }

    return { success: true }
}

interface Course extends Prisma.CourseGetPayload<{
        include: {
            CourseSection: {
                include: {
                    CourseItem: {
                        include: {
                            Material: true
                            Quiz: true
                            Task: true
                        }
                    }   
                }
            }
        }
}>
{
    progress: number
}

interface CourseItem extends Prisma.CourseItemGetPayload<{
    include: {
        Material: true
        Quiz: true
        Task: true
    }
}>
    {}

export {
    addCourseItem, addCourseItemSchema, addSection, addSectionSchema, deleteCourseItem, deleteSection, editCourseSchema, updateCourse, type Course,
    type CourseItem
};
