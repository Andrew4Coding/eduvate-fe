import { Prisma } from "@prisma/client";
// import pdfToText from 'react-pdftotext';
import { z } from "zod";
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
    const response = await fetch("/api/course/section", {
        method: "POST",
        body: JSON.stringify({
            courseId,
            ...data,
        }),
    })

    if (!response) {
        throw new Error("Failed to create section")
    }

    const responseData = await response.json()

    return { success: responseData.success, id: responseData.data.id }
}

const addCourseItem = async (sectionId: string, data: z.infer<typeof addCourseItemSchema>) => {
    if (data.type === "MATERIAL") {
        // Upload file into /api/upload
        const url = await uploadFileClient(data.file as File, data.file!.name, data.fileType as string)

        // const text = await pdfToText(data.file as File)

        const response = await fetch("/api/material/create", {
            method: "POST",
            body: JSON.stringify({
                courseSectionId: sectionId,
                ...data,
                // transcripted: text,
                transcripted: "",
                fileUrl: url.url,
            }),
        })

        if (!response) {
            throw new Error("Failed to upload file")
        }

        const responseData = await response.json()

        return { success: responseData.success }

    } else if (data.type === "QUIZ") {
        const response = await fetch("/api/quiz/create", {
            method: "POST",
            body: JSON.stringify({
                courseSectionId: sectionId,
                ...data,
            }),
        })

        if (!response) {
            throw new Error("Failed to upload file")
        }

        const responseData = await response.json()

        return { success: responseData.success, id: responseData.data.id }
    } else if (data.type === "TASK") {
        const response = await fetch("/api/task/create", {
            method: "POST",
            body: JSON.stringify({
                courseSectionId: sectionId,
                ...data,
            }),
        })
        if (!response) {
            throw new Error("Failed to upload file")
        }

        const responseData = await response.json()

        return { success: responseData.success, id: responseData.data.id }
    }

    return { success: true, id: "new-item-id" }
}

const updateCourse = async (courseId: string, data: z.infer<typeof editCourseSchema>) => {
    const response = await fetch(`/api/course/${courseId}`, {
        method: "PUT",
        body: JSON.stringify(data),
    })
    if (!response) {
        throw new Error("Failed to update course")
    }
    const responseData = await response.json()
    return { success: responseData.success }
}

const updateSection = async (sectionId: string, data: z.infer<typeof addSectionSchema>) => {
    const response = await fetch(`/api/course/section/${sectionId}`, {
        method: "PUT",
        body: JSON.stringify(data),
    })
    if (!response) {
        throw new Error("Failed to update section")
    }
    const responseData = await response.json()
    return { success: responseData.success }
}

const deleteCourse = async (courseId: string) => {
    const response = await fetch(`/api/course/${courseId}`, {
        method: "DELETE",
    })
    if (!response) {
        throw new Error("Failed to delete course")
    }
    const responseData = await response.json()
    return { success: responseData.success }
}

const deleteSection = async (sectionId: string) => {
    const response = await fetch(`/api/course/section/${sectionId}`, {
        method: "DELETE",
    })
    if (!response) {
        throw new Error("Failed to delete section")
    }
    const responseData = await response.json()
    return { success: responseData.success }
}

const deleteCourseItem = async (itemId: string) => {
    const response = await fetch(`/api/course/item/${itemId}`, {
        method: "DELETE",
    })

    if (!response) {
        throw new Error("Failed to delete item")
    }

    const responseData = await response.json()
    return { success: responseData.success }
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

