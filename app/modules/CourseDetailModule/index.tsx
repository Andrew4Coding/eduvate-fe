import { zodResolver } from "@hookform/resolvers/zod"
import { Edit, FileText, MoreVertical, Pencil, Play, Plus, PlusCircle, Smile, Trash, Video } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { useLoaderData, useNavigate, useOutletContext } from "react-router"
import { toast } from "sonner"
import { FileInput } from "~/components/elements/Dropzone"
import { Button } from "~/components/ui/button"
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "~/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "~/components/ui/select"
import { Textarea } from "~/components/ui/textarea"
import type { userData } from "~/lib/auth-client"
import { cn } from "~/lib/utils"
import { courseTypeConfig } from "../CourseModule/const"
import { addCourseItem, addCourseItemSchema, addSection, addSectionSchema, deleteCourse, deleteCourseItem, deleteSection, editCourseSchema, updateCourse, updateSection, type Course, type CourseItem } from "./const"

// Component for course item icon based on type
const CourseItemIcon = ({ type, fileType }: { type: string; fileType?: string }) => {
    if (type === "MATERIAL") {
        if (fileType === "VIDEO") {
            return (
                <div className="bg-purple-200 p-4 rounded-lg">
                    <Play className="h-8 w-8 text-purple-600" />
                </div>
            )
        }
        return (
            <div className="bg-purple-200 p-4 rounded-lg">
                <FileText className="h-8 w-8 text-purple-600" />
            </div>
        )
    }

    if (type === "QUIZ") {
        return (
            <div className="bg-purple-200 p-4 rounded-lg">
                <FileText className="h-8 w-8 text-purple-600" />
            </div>
        )
    }

    if (type === "TASK") {
        return (
            <div className="bg-purple-200 p-4 rounded-lg">
                <Pencil className="h-8 w-8 text-purple-600" />
            </div>
        )
    }

    return (
        <div className="bg-purple-200 p-4 rounded-lg">
            <FileText className="h-8 w-8 text-purple-600" />
        </div>
    )
}

export default function CourseDetail() {

    const user: userData = useOutletContext();
    const course: Course = useLoaderData();

    const [isAddSectionDialogOpen, setIsAddSectionDialogOpen] = useState(false)
    const [isEditSectionDialogOpen, setisEditSectionDialogOpen] = useState(false)
    const [isAddItemDialogOpen, setIsAddItemDialogOpen] = useState(false)
    const [isEditCourseDialogOpen, setIsEditCourseDialogOpen] = useState(false)
    const [isItemDetailDialogOpen, setIsItemDetailDialogOpen] = useState(false)
    const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null)
    const [selectedItem, setSelectedItem] = useState<CourseItem | null>(null)

    const navigate = useNavigate();

    // Forms
    const addSectionForm = useForm<z.infer<typeof addSectionSchema>>({
        resolver: zodResolver(addSectionSchema),
    })
    
    const editSectionForm = useForm<z.infer<typeof addSectionSchema>>({
        resolver: zodResolver(addSectionSchema),
        defaultValues: {
            name: selectedSectionId ? course.CourseSection.find(section => section.id === selectedSectionId)?.name : "",
            description: selectedSectionId ? course.CourseSection.find(section => section.id === selectedSectionId)?.description ?? "" : "",
        },
    })

    const addCourseItemForm = useForm<z.infer<typeof addCourseItemSchema>>({
        resolver: zodResolver(addCourseItemSchema),
        defaultValues: {
            type: "MATERIAL",
        },
    })

    const editCourseForm = useForm<z.infer<typeof editCourseSchema>>({
        resolver: zodResolver(editCourseSchema),
        defaultValues: {
            name: course.name,
            description: course.description || "",
        },
    })

    // Watch for type changes in the add course item form
    const itemType = addCourseItemForm.watch("type")

    // Handle form submissions
    const onAddSectionSubmit = async (values: z.infer<typeof addSectionSchema>) => {
        try {
            const result = await addSection(course.id, values)
            if (result.success) {
                setIsAddSectionDialogOpen(false)
                addSectionForm.reset()
                navigate(`/courses/${course.id}`)
            }
        } catch (error) {
            toast.error(`Failed to add section: ${error}`)
        }
    }

    const onEditSectionSubmit = async (values: z.infer<typeof addSectionSchema>) => {
        try {
            if (!selectedSectionId) return
            const result = await updateSection(selectedSectionId, values)
            if (result.success) {
                setisEditSectionDialogOpen(false)
                editSectionForm.reset()
                navigate(`/courses/${course.id}`)
            }
        } catch (error) {
            toast.error(`Failed to edit section: ${error}`)
        }
    }

    const onAddCourseItemSubmit = async (values: z.infer<typeof addCourseItemSchema>) => {
        try {
            if (!selectedSectionId) return

            const result = await addCourseItem(selectedSectionId, values)
            if (result.success) {
                toast.success("Course item added successfully")
                setIsAddItemDialogOpen(false)
                addCourseItemForm.reset()
                navigate(`/courses/${course.id}`)
            }
        } catch (error) {
            toast.error("Failed to add course item")
        }
    }

    const onEditCourseSubmit = async (values: z.infer<typeof editCourseSchema>) => {
        try {
            const result = await updateCourse(course.id, values)
            if (result.success) {
                setIsEditCourseDialogOpen(false)
                editCourseForm.reset()
                toast.success("Course updated successfully")
                navigate(`/courses/${course.id}`)
            }
        } catch (error) {
            toast.error(`Failed to update course: ${error}`)
        }
    }

    const handleDeleteSection = async (sectionId: string) => {
        try {
            const result = await deleteSection(sectionId)
            if (result.success) {
                toast.success("Section deleted successfully")
                navigate(`/courses/${course.id}`)
            }
        } catch (error) {
            toast.error(`Failed to delete section: ${error}` )
        }
    }

    const handleDeleteCourseItem = async (itemId: string) => {
        try {
            const result = await deleteCourseItem(itemId)
            if (result.success) {
                toast.success("Course item deleted successfully")
                navigate(`/courses/${course.id}`)
            }
        } catch (error) {
            toast.error(`Failed to delete Course Item: ${error}`)
        }
    }

    const openAddItemDialog = (sectionId: string) => {
        setSelectedSectionId(sectionId)
        setIsAddItemDialogOpen(true)
    }

    const openItemDetailDialog = (item: CourseItem) => {
        setSelectedItem(item)
        setIsItemDetailDialogOpen(true)
    }

    const config = courseTypeConfig[course.category]

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Mata Pelajaran</h1>

                    {user.role === "teacher" && (
                        <div
                            className="flex items-center gap-4"
                        >
                            <Button variant="outline" onClick={() => setIsEditCourseDialogOpen(true)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Course
                            </Button>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <Button
                                        variant="destructive">
                                        <Trash className="h-4 w-4 mr-2" />
                                        Delete Course
                                    </Button>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Confirm Deletion</DialogTitle>
                                        <DialogDescription>
                                            Are you sure you want to delete this course? This action cannot be undone.
                                        </DialogDescription>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="outline">
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button variant="destructive" onClick={async () => {
                                            // Handle course deletion logic here
                                            const result = await deleteCourse(course.id)
                                            if (!result.success) {
                                                toast.error("Failed to delete course")
                                                return
                                            }
                                            toast.success("Course deleted successfully")
                                            navigate("/courses")
                                        }}>
                                            Delete
                                        </Button>
                                    </DialogFooter>
                                </DialogContent>
                            </Dialog>
                        </div>
                    )}
                </div>

                {/* Course Header Card */}
                <div className={cn("rounded-xl p-6 mb-8", config.color)}>
                    <div className="flex items-center gap-4">
                        <div className="p-4 bg-white/20 rounded-xl">{config.icon}</div>

                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-white mb-2">{course.name}</h2>
                            {course.description && <p className="text-white/80 mb-4">{course.description}</p>}

                            <div className="mt-4">
                                <div className="flex justify-between text-white mb-1">
                                    <span className="text-sm font-medium">{course.progress || 0}%</span>
                                    <span className="text-sm font-medium uppercase">{course.code}</span>
                                </div>
                                <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                                    <div className="h-full bg-white rounded-full" style={{ width: `${course.progress || 0}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Course Sections */}
                <div className="space-y-8">
                    {course.CourseSection.map((section) => (
                        <div key={section.id} className="rounded-xl bg-purple-100 p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xl font-bold text-purple-900">{section.name}</h3>

                                {user.role === "teacher" && (
                                    <div className="flex items-center gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => openAddItemDialog(section.id)}>
                                            <PlusCircle className="h-4 w-4 mr-2" />
                                            Add Item
                                        </Button>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem
                                                    onClick={() => {
                                                        setSelectedSectionId(section.id)
                                                        setisEditSectionDialogOpen(true)
                                                    }}
                                                >Edit Section</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteSection(section.id)}>
                                                    Delete Section
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </div>
                                )}
                            </div>

                            <Dialog
                                open={isEditSectionDialogOpen}
                                onOpenChange={setisEditSectionDialogOpen}
                            >
                                <DialogTrigger asChild>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>Edit Section</DialogTitle>
                                        <DialogDescription>Create a new section for your course.</DialogDescription>
                                    </DialogHeader>

                                    <Form {...editSectionForm}>
                                        <form onSubmit={editSectionForm.handleSubmit(onEditSectionSubmit)} className="space-y-4">
                                            <FormField
                                                control={editSectionForm.control}
                                                name="name"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Section Name</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g. Week 1" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={editSectionForm.control}
                                                name="description"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Description (Optional)</FormLabel>
                                                        <FormControl>
                                                            <Textarea placeholder="Brief description of this section" className="resize-none" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <DialogFooter>
                                                <Button type="submit">Edit Section</Button>
                                            </DialogFooter>
                                        </form>
                                    </Form>
                                </DialogContent>
                            </Dialog>

                            {section.description && <p className="text-purple-700 mb-4">{section.description}</p>}

                            {/* Course Items */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {section.CourseItem.map((item) => (
                                    <div
                                        key={item.id}
                                        className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
                                        onClick={() => openItemDetailDialog(item)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <CourseItemIcon type={item.type} fileType={item.Material?.fileType} />

                                            <div className="flex-1">
                                                <h4 className="font-medium text-gray-900">{item.name}</h4>
                                                {item.description && <p className="text-sm text-gray-500 line-clamp-1">{item.description}</p>}
                                            </div>

                                            {user.role === "teacher" && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                                        <Button variant="ghost" size="icon">
                                                            <MoreVertical className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuItem>Edit Item</DropdownMenuItem>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuItem
                                                            className="text-red-600"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                handleDeleteCourseItem(item.id)
                                                            }}
                                                        >
                                                            Delete Item
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {section.CourseItem.length === 0 && (
                                    <div className="col-span-2 text-center py-8 text-gray-500">
                                        No items in this section yet.
                                        {user.role === "teacher" && (
                                            <div className="mt-2">
                                                <Button variant="outline" size="sm" onClick={() => openAddItemDialog(section.id)}>
                                                    <Plus className="h-4 w-4 mr-2" />
                                                    Add Item
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {course.CourseSection.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-xl">
                            <Smile className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-xl font-medium text-gray-700 mb-2">No sections yet</h3>
                            <p className="text-gray-500 mb-4">This course doesn't have any sections yet.</p>

                            {user.role === "teacher" && (
                                <Button onClick={() => setIsAddSectionDialogOpen(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Section
                                </Button>
                            )}
                        </div>
                    )}

                    {user.role === "teacher" && course.CourseSection.length > 0 && (
                        <div className="flex justify-center mt-8">
                            <Button onClick={() => setIsAddSectionDialogOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add Section
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Add Section Dialog */}
            <Dialog open={isAddSectionDialogOpen} onOpenChange={setIsAddSectionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Add New Section</DialogTitle>
                        <DialogDescription>Create a new section for your course.</DialogDescription>
                    </DialogHeader>

                    <Form {...addSectionForm}>
                        <form onSubmit={addSectionForm.handleSubmit(onAddSectionSubmit)} className="space-y-4">
                            <FormField
                                control={addSectionForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Section Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Week 1" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={addSectionForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Brief description of this section" className="resize-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="submit">Add Section</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Add Course Item Dialog */}
            <Dialog open={isAddItemDialogOpen} onOpenChange={setIsAddItemDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Add New Item</DialogTitle>
                        <DialogDescription>Add a new material, quiz, or task to this section.</DialogDescription>
                    </DialogHeader>

                    <Form {...addCourseItemForm}>
                        <form onSubmit={addCourseItemForm.handleSubmit(onAddCourseItemSubmit)} className="space-y-4">
                            <FormField
                                control={addCourseItemForm.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Item Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select item type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="MATERIAL">Material</SelectItem>
                                                <SelectItem value="QUIZ">Quiz</SelectItem>
                                                <SelectItem value="TASK">Task</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={addCourseItemForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Item Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g. Introduction Video" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={addCourseItemForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Brief description of this item" className="resize-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {itemType === "MATERIAL" && (
                                <>
                                    <FormField
                                        control={addCourseItemForm.control}
                                        name="fileType"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>File Type</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select file type" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        <SelectItem value="PDF">PDF</SelectItem>
                                                        <SelectItem value="VIDEO">Video</SelectItem>
                                                        <SelectItem value="AUDIO">Audio</SelectItem>
                                                        <SelectItem value="PPT">Presentation</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={addCourseItemForm.control}
                                        name="file"
                                        render={() => (
                                            <FormItem>
                                                <FormLabel>File</FormLabel>
                                                <FormControl>
                                                    <FileInput
                                                        file={
                                                            addCourseItemForm.getValues("file") as File | null
                                                        }
                                                        onFileChange={(file: File) => {
                                                            addCourseItemForm.setValue("file", file as File)
                                                        }}
                                                        secondaryMessage="Upload Material File"
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}

                            {(itemType === "TASK" || itemType === "QUIZ") && (
                                <>
                                    <FormField
                                        control={addCourseItemForm.control}
                                        name="openDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Open Date</FormLabel>
                                                <FormControl>
                                                    <Input type="datetime-local" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={addCourseItemForm.control}
                                        name="dueDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Due Date</FormLabel>
                                                <FormControl>
                                                    <Input type="datetime-local" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={addCourseItemForm.control}
                                        name="closeDate"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Close Date</FormLabel>
                                                <FormControl>
                                                    <Input type="datetime-local" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </>
                            )}
                            <DialogFooter>
                                <Button type="submit">Add Item</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Edit Course Dialog */}
            <Dialog open={isEditCourseDialogOpen} onOpenChange={setIsEditCourseDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Course</DialogTitle>
                        <DialogDescription>Update the course details.</DialogDescription>
                    </DialogHeader>

                    <Form {...editCourseForm}>
                        <form onSubmit={editCourseForm.handleSubmit(onEditCourseSubmit)} className="space-y-4">
                            <FormField
                                control={editCourseForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Course Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={editCourseForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea className="resize-none" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <DialogFooter>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {/* Item Detail Dialog */}
            <Dialog open={isItemDetailDialogOpen} onOpenChange={setIsItemDetailDialogOpen}>
                <DialogContent className="sm:max-w-[600px]">
                    {selectedItem && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedItem.name}</DialogTitle>
                                {selectedItem.description && <DialogDescription>{selectedItem.description}</DialogDescription>}
                            </DialogHeader>

                            <div className="space-y-4">
                                {selectedItem.type === "MATERIAL" && selectedItem.Material && (
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium">Type:</span>
                                            <span>{selectedItem.Material.fileType}</span>
                                        </div>

                                        {selectedItem.Material.fileType === "VIDEO" && (
                                            <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                                                <Video className="h-12 w-12 text-gray-400" />
                                            </div>
                                        )}

                                        {selectedItem.Material.fileType === "PDF" && (
                                            <div className="p-4 border rounded-lg">
                                                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                                                <p className="text-center text-sm text-gray-500">PDF Document</p>
                                            </div>
                                        )}

                                        <Button className="w-full" asChild>
                                            <a href={selectedItem.Material.fileUrl} target="_blank" rel="noopener noreferrer">
                                                View Material
                                            </a>
                                        </Button>
                                    </div>
                                )}

                                {selectedItem.type === "QUIZ" && (
                                    <div className="space-y-4">
                                        <p className="text-gray-600">This is a quiz. Click the button below to start.</p>

                                        <Button className="w-full">Start Quiz</Button>
                                    </div>
                                )}

                                {selectedItem.type === "TASK" && selectedItem.Task && (
                                    <div className="space-y-4">
                                        {(selectedItem.Task.openDate || selectedItem.Task.dueDate || selectedItem.Task.closeDate) && (
                                            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
                                                {selectedItem.Task.openDate && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Opens:</span>
                                                        <span className="font-medium">{new Date(selectedItem.Task.openDate).toLocaleString()}</span>
                                                    </div>
                                                )}

                                                {selectedItem.Task.dueDate && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Due:</span>
                                                        <span className="font-medium">{new Date(selectedItem.Task.dueDate).toLocaleString()}</span>
                                                    </div>
                                                )}

                                                {selectedItem.Task.closeDate && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Closes:</span>
                                                        <span className="font-medium">
                                                            {new Date(selectedItem.Task.closeDate).toLocaleString()}
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <Button className="w-full">{user.role === "student" ? "Submit Task" : "View Submissions"}</Button>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}
