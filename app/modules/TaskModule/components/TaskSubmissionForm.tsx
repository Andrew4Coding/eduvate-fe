import { zodResolver } from "@hookform/resolvers/zod"
import { Check, File, Upload } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "~/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"

const formSchema = z.object({
    file: z.any().refine((files) => files.length > 0, {
        message: "Please upload a file",
    }),
    notes: z.string().optional(),
})

interface TaskSubmissionFormProps {
    taskId: string
    userId: string
}

export default function TaskSubmissionForm({ taskId, userId }: TaskSubmissionFormProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [isSuccess, setIsSuccess] = useState(false)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            notes: "",
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        setIsUploading(true)
        setUploadProgress(0)

        // Simulate file upload with progress
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setIsUploading(false)
                    setIsSuccess(true)

                    // Reset form after 2 seconds
                    setTimeout(() => {
                        setIsSuccess(false)
                        form.reset()
                    }, 2000)

                    return 100
                }
                return prev + 10
            })
        }, 300)

        // In a real app, you would upload the file to your server
        console.log("Submitting task:", {
            taskId,
            userId,
            file: values.file[0],
            notes: values.notes,
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="file"
                    render={({ field: { onChange, value, ...rest } }) => (
                        <FormItem>
                            <FormLabel>Upload File</FormLabel>
                            <FormControl>
                                <div className="grid w-full gap-2">
                                    <div
                                        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${form.watch("file")?.length
                                                ? "border-green-200 bg-green-50"
                                                : "border-muted-foreground/25 hover:border-muted-foreground/50"
                                            }`}
                                    >
                                        <Input
                                            type="file"
                                            className="hidden"
                                            id="file-upload"
                                            onChange={(event) => {
                                                onChange(event.target.files)
                                            }}
                                            {...rest}
                                        />
                                        <label
                                            htmlFor="file-upload"
                                            className="flex flex-col items-center justify-center gap-2 cursor-pointer"
                                        >
                                            {form.watch("file")?.length ? (
                                                <>
                                                    <File className="h-10 w-10 text-green-500" />
                                                    <p className="font-medium text-green-600">{form.watch("file")?.[0]?.name}</p>
                                                    <p className="text-sm text-muted-foreground">Click to change file</p>
                                                </>
                                            ) : (
                                                <>
                                                    <Upload className="h-10 w-10 text-muted-foreground" />
                                                    <p className="font-medium">Drag and drop your file here or click to browse</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        PDF, Word, ZIP, or other document formats accepted
                                                    </p>
                                                </>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Notes (Optional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Add any notes about your submission..." className="resize-none" {...field} />
                            </FormControl>
                            <FormDescription>Include any information that might help your instructor when grading.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div>
                    {isUploading ? (
                        <div className="space-y-2">
                            <div className="w-full bg-muted rounded-full h-2.5">
                                <div
                                    className="bg-primary h-2.5 rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%` }}
                                ></div>
                            </div>
                            <p className="text-sm text-muted-foreground">Uploading... {uploadProgress}%</p>
                        </div>
                    ) : isSuccess ? (
                        <Button className="w-full" variant="outline" disabled>
                            <Check className="mr-2 h-4 w-4" /> Submission Complete
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full">
                            Submit Assignment
                        </Button>
                    )}
                </div>
            </form>
        </Form>
    )
}
