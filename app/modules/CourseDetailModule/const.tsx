import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { fetchClient } from "~/lib/fetch";
const addSectionSchema = z.object({
    name: z.string().min(1, "Section name is required"),
    description: z.string().optional(),
})

const addCourseItemSchema = z.object({
    name: z.string().min(1, "Item name is required"),
    description: z.string().optional(),
    type: z.enum(["MATERIAL", "QUIZ", "TASK"]),
    fileUrl: z.string().optional(),
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

    console.log(responseData);
    
    
    return { success: true, id: "new-section-id" }
}

const addCourseItem = async (sectionId: string, data: z.infer<typeof addCourseItemSchema>) => {
    console.log(`Adding item to section ${sectionId}:`, data)
    return { success: true, id: "new-item-id" }
}

const updateCourse = async (courseId: string, data: z.infer<typeof editCourseSchema>) => {
    console.log(`Updating course ${courseId}:`, data)
    return { success: true }
}

const deleteSection = async (sectionId: string) => {
    console.log(`Deleting section ${sectionId}`)
    return { success: true }
}

const deleteCourseItem = async (itemId: string) => {
    console.log(`Deleting course item ${itemId}`)
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
    addSectionSchema,
    addCourseItemSchema,
    editCourseSchema,
    addSection,
    addCourseItem,
    updateCourse,
    deleteSection,
    deleteCourseItem,
    type Course,
    type CourseItem,
}