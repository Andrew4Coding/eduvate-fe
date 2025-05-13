import type { Prisma } from "@prisma/client";
import pdfToText from 'react-pdftotext';
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
    extractedText: z.string().optional(),
})

const editCourseSchema = z.object({
    name: z.string().min(1, "Course name is required"),
    description: z.string().optional(),
})

// Mock functions for API calls
const addSection = async (courseId: string, data: z.infer<typeof addSectionSchema>) => {
    const responseData = await fetchClient("/api/course/section", {
        method: "POST",
        body: JSON.stringify({
            courseId,
            ...data,
        }),
    })

    if (!responseData) {
        throw new Error("Failed to create section")
    }

    return { success: true, id: "new-section-id" }
}

const addCourseItem = async (sectionId: string, data: z.infer<typeof addCourseItemSchema>) => {
    if (data.type === "MATERIAL") {
        // Upload file into /api/upload
        const url = await uploadFileClient(data.file as File, data.file!.name, data.fileType as string)

        let extractedText = ""

        const text = await pdfToText(data.file as File)

        const responseData = await fetchClient("/api/material/create", {
            method: "POST",
            body: JSON.stringify({
                courseSectionId: sectionId,
                ...data,
                transcripted: text,
                fileUrl: url.url,
                extractedText,
            }),
        })

        if (!responseData) {
            throw new Error("Failed to upload file")
        }

        return { success: true, id: "new-item-id" }
    } else if (data.type === "QUIZ") {
        const responseData = fetchClient("/api/quiz/create", {
            method: "POST",
            body: JSON.stringify({
                courseSectionId: sectionId,
                ...data,
            }),
        })

        if (!responseData) {
            throw new Error("Failed to upload file")
        }

        return { success: true, id: "new-item-id" }
    } else if (data.type === "TASK") {
        const responseData = fetchClient("/api/task/create", {
            method: "POST",
            body: JSON.stringify({
                courseSectionId: sectionId,
                ...data,
            }),
        })
        if (!responseData) {
            throw new Error("Failed to upload file")
        }

        return { success: true, id: "new-item-id" }
    }

    return { success: true, id: "new-item-id" }
}

const updateCourse = async (courseId: string, data: z.infer<typeof editCourseSchema>) => {
    const responseData = await fetchClient(`/api/course/${courseId}`, {
        method: "PUT",
        body: JSON.stringify(data),
    })
    if (!responseData) {
        throw new Error("Failed to update course")
    }
    return { success: true }
}

const updateSection = async (sectionId: string, data: z.infer<typeof addSectionSchema>) => {
    const responseData = await fetchClient(`/api/course/section/${sectionId}`, {
        method: "PUT",
        body: JSON.stringify(data),
    })
    if (!responseData) {
        throw new Error("Failed to update section")
    }
    return { success: true }
}

const deleteCourse = async (courseId: string) => {
    const responseData = await fetchClient(`/api/course/${courseId}`, {
        method: "DELETE",
    })
    if (!responseData) {
        throw new Error("Failed to delete course")
    }
    return { success: true }
}

const deleteSection = async (sectionId: string) => {
    const responseData = await fetchClient(`/api/course/section/${sectionId}`, {
        method: "DELETE",
    })
    if (!responseData) {
        throw new Error("Failed to delete section")
    }
    return { success: true }
}

const deleteCourseItem = async (itemId: string) => {
    const responseData = await fetchClient(`/api/course/item/${itemId}`, {
        method: "DELETE",
    })

    if (!responseData) {
        throw new Error("Failed to delete item")
    }

    return { success: true }
}

interface Course
    extends Prisma.CourseGetPayload<{
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
    }> {
    progress: number
}

interface CourseItem
    extends Prisma.CourseItemGetPayload<{
        include: {
            Material: true
            Quiz: true
            Task: true
        }
    }> { }

export {
    addCourseItem,
    addCourseItemSchema,
    addSection,
    addSectionSchema,
    deleteCourse,
    deleteCourseItem,
    deleteSection,
    editCourseSchema,
    updateCourse,
    updateSection,
    type Course,
    type CourseItem
};

