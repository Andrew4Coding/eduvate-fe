import type { COURSE_CATEGORY } from "@prisma/client";
import { Atom, BarChart3, BookText, DollarSign, Dumbbell, Globe, Languages, Music, Palette, Plus, Smile } from "lucide-react";
import { z } from "zod";

export const courseTypeConfig: Record<COURSE_CATEGORY, { color: string; bgColor: string; icon: React.ReactNode; label: string }> = {
    SOCIOLOGY: {
        color: "bg-purple-500",
        bgColor: "bg-purple-100",
        icon: <Smile className="h-8 w-8 text-white" />,
        label: "Sociology",
    },
    GEOGRAPHY: {
        color: "bg-green-500",
        bgColor: "bg-green-100",
        icon: <Globe className="h-8 w-8 text-white" />,
        label: "Geography",
    },
    ENGLISH: {
        color: "bg-indigo-500",
        bgColor: "bg-indigo-100",
        icon: <Languages className="h-8 w-8 text-white" />,
        label: "English",
    },
    MATHEMATICS: {
        color: "bg-yellow-500",
        bgColor: "bg-yellow-100",
        icon: <Plus className="h-8 w-8 text-white" />,
        label: "Mathematics",
    },
    ECONOMICS: {
        color: "bg-blue-400",
        bgColor: "bg-blue-100",
        icon: <DollarSign className="h-8 w-8 text-white" />,
        label: "Economics",
    },
    HISTORY: {
        color: "bg-red-400",
        bgColor: "bg-red-100",
        icon: <BookText className="h-8 w-8 text-white" />,
        label: "History",
    },
    SCIENCE: {
        color: "bg-teal-500",
        bgColor: "bg-teal-100",
        icon: <Atom className="h-8 w-8 text-white" />,
        label: "Science",
    },
    STATISTICS: {
        color: "bg-violet-500",
        bgColor: "bg-violet-100",
        icon: <BarChart3 className="h-8 w-8 text-white" />,
        label: "Statistics",
    },
    MUSIC: {
        color: "bg-pink-500",
        bgColor: "bg-pink-100",
        icon: <Music className="h-8 w-8 text-white" />,
        label: "Music",
    },
    ART: {
        color: "bg-amber-500",
        bgColor: "bg-amber-100",
        icon: <Palette className="h-8 w-8 text-white" />,
        label: "Art",
    },
    PHYSICAL_EDUCATION: {
        color: "bg-emerald-500",
        bgColor: "bg-emerald-100",
        icon: <Dumbbell className="h-8 w-8 text-white" />,
        label: "Physical Education",
    },
}

// Zod schema for course enrollment
const enrollCourseSchema = z.object({
    courseCode: z.string().min(1, "Course code is required"),
})

// Zod schema for course creation
const createCourseSchema = z.object({
    name: z.string().min(3, "Course name must be at least 3 characters"),
    code: z.string().min(3, "Course code must be at least 3 characters"),
    description: z.string().optional(),
    category: z.enum([
        "SOCIOLOGY",
        "GEOGRAPHY",
        "ENGLISH",
        "MATHEMATICS",
        "ECONOMICS",
        "HISTORY",
        "SCIENCE",
        "ART",
        "MUSIC",
        "PHYSICAL_EDUCATION",
        "STATISTICS",
    ]),
    isHidden: z.boolean(),
})

// Mock function to enroll in a course
const enrollInCourse = async (courseCode: string) => {
    console.log(`Enrolling in course with code: ${courseCode}`)
    const response = await fetch("/api/course/enroll", {
        method: "POST",
        body: JSON.stringify({ courseCode })
    })

    const responseData = await response.json()

    return { 
        success: responseData.data.error !== true,
        message: responseData.data.message
     }
}

// Mock function to create a course
const createCourse = async (courseData: z.infer<typeof createCourseSchema>) => {
    console.log("Creating course:", courseData)

    const response = await fetch("/api/course", {
        method: "POST",
        body: JSON.stringify(courseData)
    })

    const responseData = await response.json()

    return { success: responseData.success, id: responseData.data.id }
}

export {
    createCourse, createCourseSchema, enrollCourseSchema, enrollInCourse
};
