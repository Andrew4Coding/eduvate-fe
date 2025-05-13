import { zodResolver } from "@hookform/resolvers/zod"
import {
    PlusCircle,
    Smile
} from "lucide-react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import type { COURSE_CATEGORY } from "@prisma/client"
import { useState } from "react"
import { Link, useLoaderData, useNavigate, useOutletContext } from "react-router"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Card, CardContent } from "~/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Switch } from "~/components/ui/switch"
import { Textarea } from "~/components/ui/textarea"
import type { userData } from "~/lib/auth-client"
import { cn } from "~/lib/utils"
import { courseTypeConfig, createCourse, createCourseSchema, enrollCourseSchema, enrollInCourse } from "./const"

// Define the interface for course data
interface Course {
    id: string
    name: string
    code: string
    shortCode?: string
    category: COURSE_CATEGORY
    progress?: number
    teacher?: string
    description?: string
    totalLessons?: number
    completedLessons?: number
    isHidden?: boolean
}

export default function CourseManagement() {
    const user: userData = useOutletContext();
    const courses: Course[] = useLoaderData();

    const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false)
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
    const [enrollmentStatus, setEnrollmentStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
    const [creationStatus, setCreationStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

    // Form for course enrollment
    const enrollForm = useForm<z.infer<typeof enrollCourseSchema>>({
        resolver: zodResolver(enrollCourseSchema),
        defaultValues: {
            courseCode: "",
        },
    })

    // Form for course creation
    const createForm = useForm<z.infer<typeof createCourseSchema>>({
        resolver: zodResolver(createCourseSchema),
        defaultValues: {
            name: "",
            code: "",
            description: "",
            category: "MATHEMATICS",
            isHidden: false,
        },
    })

    // Handle course enrollment
    const onEnrollSubmit = async (values: z.infer<typeof enrollCourseSchema>) => {
        try {
            setEnrollmentStatus("loading")
            const result = await enrollInCourse(values.courseCode)

            if (result.success) {
                setEnrollmentStatus("success")
                setTimeout(() => {
                    setIsEnrollDialogOpen(false)
                    setEnrollmentStatus("idle")
                    enrollForm.reset()
                }, 1500)
            } else {
                setEnrollmentStatus("error")
            }
        } catch (error) {
            setEnrollmentStatus("error")
        }
    }

    const navigate = useNavigate()

    // Handle course creation
    const onCreateSubmit = async (values: z.infer<typeof createCourseSchema>) => {
        try {
            setCreationStatus("loading")
            const result = await createCourse(values)

            if (result.success) {
                setCreationStatus("success")
                setTimeout(() => {
                    setIsCreateDialogOpen(false)
                    setCreationStatus("idle")
                    createForm.reset()
                }, 1500)
                navigate(`/dashboard/courses/${result.id}`)
            } else {
                setCreationStatus("error")
            }
        } catch (error) {
            setCreationStatus("error")
        }
    }

    return (
        <div className="min-h-screen  overflow-hidden">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Mata Pelajaran
                    </h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    aria-description="content"
                >
                    {courses.map((course) => {
                        const config = courseTypeConfig[course.category]

                        return (
                            <Card
                                aria-description="content"
                                key={course.id}
                                className={cn("rounded-xl overflow-hidden transition-transform hover:scale-[1.02]")}
                            >
                                <div className={cn("h-2", config.color)}></div>
                                <CardContent className="pt-6">
                                    {course.progress !== undefined && (
                                        <div className="mb-6">
                                            <div className="flex justify-between text-gray-600 mb-1">
                                                <span className="text-sm font-medium">{course.progress}%</span>
                                                <span className="text-sm font-medium">
                                                    {course.completedLessons}/{course.totalLessons} Lessons
                                                </span>
                                            </div>
                                            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={cn("h-full rounded-full", config.color)}
                                                    style={{ width: `${course.progress}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-start gap-4">
                                        <div className={cn("p-3 rounded-xl", config.color)}>{config.icon}</div>

                                        <div className="flex-1 space-y-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 className="text-xl font-bold text-gray-800">{course.name}</h3>
                                                <Badge variant="secondary">{course.shortCode || course.code}</Badge>
                                            </div>

                                            {course.description && <p className="text-gray-600 text-sm line-clamp-2">{course.description}</p>}

                                            <Link
                                                to={`/dashboard/courses/${course.id}`}
                                            >
                                                <Button
                                                    id="view-details"
                                                    className="w-full">View Details</Button>
                                            </Link>

                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}

                    {user.role === "student" ? (
                        <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
                            <DialogTrigger asChild>
                                <button
                                    id="enroll-course"
                                    className="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg cursor-pointer hover:bg-gray-50/50 duration-300">
                                    <PlusCircle className="h-16 w-16 text-gray-400 mb-4" />
                                    <p className="text-gray-500">Enroll in a Course</p>
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Enroll in a Course</DialogTitle>
                                    <DialogDescription>Enter the course code provided by your teacher to enroll.</DialogDescription>
                                </DialogHeader>

                                <Form {...enrollForm}>
                                    <form
                                        id="enroll-course-form"
                                        onSubmit={enrollForm.handleSubmit(onEnrollSubmit)} className="space-y-4">
                                        <FormField
                                            control={enrollForm.control}
                                            name="courseCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Course Code</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            id="field-courseCode"
                                                            placeholder="Enter course code" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <DialogFooter>
                                            <Button
                                                id="enroll-course-submit"
                                                type="submit" disabled={enrollmentStatus === "loading"}>
                                                {enrollmentStatus === "loading"
                                                    ? "Enrolling..."
                                                    : enrollmentStatus === "success"
                                                        ? "Enrolled!"
                                                        : "Enroll"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    ) : (
                            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}                            >
                            <DialogTrigger asChild>
                                <button
                                    id="create-course"
                                    className="flex flex-col items-center justify-center p-6 border border-dashed rounded-lg cursor-pointer hover:bg-gray-50">
                                    <PlusCircle className="h-16 w-16 text-gray-400 mb-4" />
                                    <p className="text-gray-500">Create a Course</p>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[525px]">
                                <DialogHeader>
                                    <DialogTitle>Create a New Course</DialogTitle>
                                    <DialogDescription>Fill in the details to create a new course for your students.</DialogDescription>
                                </DialogHeader>

                                <Form {...createForm}>
                                    <form
                                            onSubmit={createForm.handleSubmit(onCreateSubmit)} className="space-y-4">
                                        <FormField
                                            control={createForm.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Course Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. Advanced Mathematics" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={createForm.control}
                                            name="code"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Course Code</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g. MATH101" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Students will use this code to enroll in your course.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={createForm.control}
                                            name="description"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Description (Optional)</FormLabel>
                                                    <FormControl>
                                                        <Textarea
                                                            placeholder="Brief description of the course"
                                                            className="resize-none"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={createForm.control}
                                            name="category"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Category</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a category" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {Object.entries(courseTypeConfig).map(([key, config]) => (
                                                                <SelectItem key={key} value={key}>
                                                                    <div className="flex items-center">
                                                                        <div className={`w-3 h-3 rounded-full mr-2 ${config.color}`}></div>
                                                                        {config.label}
                                                                    </div>
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={createForm.control}
                                            name="isHidden"
                                            render={({ field }) => (
                                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                                    <div className="space-y-0.5">
                                                        <FormLabel>Hidden Course</FormLabel>
                                                        <FormDescription>Hide this course from the course listing</FormDescription>
                                                    </div>
                                                    <FormControl>
                                                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />

                                        <DialogFooter>
                                            <Button type="submit" disabled={creationStatus === "loading"}>
                                                {creationStatus === "loading"
                                                    ? "Creating..."
                                                    : creationStatus === "success"
                                                        ? "Created!"
                                                        : "Create Course"}
                                            </Button>
                                        </DialogFooter>
                                    </form>
                                </Form>
                            </DialogContent>
                        </Dialog>
                    )}

                    {!courses.length && (
                        <div
                            aria-description="content"
                            className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col items-center justify-center py-16 space-y-4">
                            <Smile className="h-16 w-16 text-gray-400 mb-4" />
                            <div className="text-center space-y-2">
                                <p className="font-bold text-2xl">No courses available.</p>
                                <p className="text-gray-500">
                                    {user.role === "student"
                                        ? "Please contact your teacher for more information or enroll in a course."
                                        : "Create your first course to get started."}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
