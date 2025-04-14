"use client"

import { format } from "date-fns"
import { Calendar, Clock, FileText, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { Badge } from "~/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import TaskAttachmentsList from "./TaskAttachmentList"
import TaskSubmissionForm from "./TaskSubmissionForm"
import TaskSubmissionsList from "./TaskSubmissionList"
import TaskSubmissionViewer from "./TaskSubmissionViewer"
import { useParams } from "react-router"

// Mock data - in a real app, this would come from your API
const mockTask = {
    id: "task123",
    title: "Assignment: Data Structures Implementation",
    description: "Implement a binary search tree and demonstrate its operations with proper documentation.",
    openDate: new Date("2025-03-03T00:00:00"),
    dueDate: new Date("2025-03-22T23:55:00"),
    closeDate: new Date("2025-03-25T23:59:00"),
    courseItemId: "course123",
    attachments: [
        {
            id: "att1",
            name: "Assignment Guidelines",
            description: "Detailed instructions for the assignment",
            fileUrl: "/files/guidelines.pdf",
            fileType: "PDF",
            isHidden: false,
        },
        {
            id: "att2",
            name: "Example Implementation",
            description: "Sample code to help you get started",
            fileUrl: "/files/example.zip",
            fileType: "ZIP",
            isHidden: false,
        },
    ],
    submissions: [
        {
            id: "sub1",
            studentId: "student1",
            studentName: "Alex Johnson",
            taskId: "task123",
            fileUrl: "/submissions/alex_submission.pdf",
            isGraded: true,
            isHidden: false,
            createdAt: new Date("2025-03-20T14:30:00"),
            grade: 85,
            feedback: "Good work, but could improve code documentation.",
            graderId: "teacher1",
        },
        {
            id: "sub2",
            studentId: "student2",
            studentName: "Jamie Smith",
            taskId: "task123",
            fileUrl: "/submissions/jamie_submission.pdf",
            isGraded: false,
            isHidden: false,
            createdAt: new Date("2025-03-21T16:45:00"),
            grade: null,
            feedback: null,
            graderId: null,
        },
    ],
}

interface TaskDashboardProps {
    taskId: string
}

export default function TaskDashboard() {
    const [task, setTask] = useState(mockTask)
    const [selectedSubmission, setSelectedSubmission] = useState<any>(null)
    const [userData, setUserData] = useState<any>({
        role: "teacher", // Change to 'student' or 'admin' to test different roles
        id: "teacher1",
        name: "Dr. Smith",
        email: "smith@example.edu",
        emailVerified: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        image: "/placeholder.svg?height=40&width=40",
    })

    const params = useParams();
    const taskId = params.id;


    const isTeacher = userData.role === "teacher" || userData.role === "admin"
    const isStudent = userData.role === "student"
    const isAdmin = userData.role === "admin"

    const getStatusBadge = () => {
        const now = new Date()

        if (now < task.openDate) {
            return (
                <Badge variant="outline" className="bg-gray-100">
                    Not Open Yet
                </Badge>
            )
        }

        if (now > task.closeDate) {
            return (
                <Badge variant="outline" className="bg-red-100 text-red-800">
                    Closed
                </Badge>
            )
        }

        if (now > task.dueDate) {
            return (
                <Badge variant="outline" className="bg-amber-100 text-amber-800">
                    Late Submission
                </Badge>
            )
        }

        return (
            <Badge variant="outline" className="bg-green-100 text-green-800">
                Open
            </Badge>
        )
    }

    return (
        <div className="space-y-6 container mx-auto px-4 py-8">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{task.title}</h1>
                <p className="text-muted-foreground mt-1">{task.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="md:col-span-2">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-medium">Task Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Open Date:</span>
                            <span className="text-sm text-muted-foreground">{format(task.openDate, "PPP 'at' p")}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Due Date:</span>
                            <span className="text-sm text-muted-foreground">{format(task.dueDate, "PPP 'at' p")}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Close Date:</span>
                            <span className="text-sm text-muted-foreground">{format(task.closeDate, "PPP 'at' p")}</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">Status:</span>
                            {getStatusBadge()}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-medium">Task Resources</CardTitle>
                        <CardDescription>Files and resources for this task</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <TaskAttachmentsList attachments={task.attachments} />
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue={isTeacher ? "submissions" : "submit"}>
                <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-3">
                    {isStudent && <TabsTrigger value="submit">Submit Work</TabsTrigger>}
                    {isTeacher && <TabsTrigger value="submissions">All Submissions</TabsTrigger>}
                    <TabsTrigger value="my-submissions">My Submissions</TabsTrigger>
                    {selectedSubmission && <TabsTrigger value="view">View Submission</TabsTrigger>}
                </TabsList>

                {isStudent && (
                    <TabsContent value="submit" className="mt-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Submit Your Work</CardTitle>
                                <CardDescription>Upload your assignment files here</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <TaskSubmissionForm taskId={task.id} userId={userData.id} />
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}

                {isTeacher && (
                    <TabsContent value="submissions" className="mt-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>All Submissions</CardTitle>
                                    <CardDescription>View and grade student submissions</CardDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{task.submissions.length} submissions</span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <TaskSubmissionsList
                                    submissions={task.submissions}
                                    onSelect={setSelectedSubmission}
                                    isTeacher={isTeacher}
                                />
                            </CardContent>
                        </Card>
                    </TabsContent>
                )}

                <TabsContent value="my-submissions" className="mt-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>My Submissions</CardTitle>
                            <CardDescription>Your submission history for this task</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <TaskSubmissionsList
                                submissions={task.submissions.filter((sub) => sub.studentId === userData.id)}
                                onSelect={setSelectedSubmission}
                                isTeacher={false}
                            />
                        </CardContent>
                    </Card>
                </TabsContent>

                {selectedSubmission && (
                    <TabsContent value="view" className="mt-4">
                        <TaskSubmissionViewer
                            submission={selectedSubmission}
                            isTeacher={isTeacher}
                            onGrade={(grade, feedback) => {
                                // In a real app, you would update the submission via API
                                console.log("Grading submission:", grade, feedback)

                                // Update local state for demo
                                const updatedSubmissions = task.submissions.map((sub) =>
                                    sub.id === selectedSubmission.id
                                        ? { ...sub, grade, feedback, isGraded: true, graderId: userData.id }
                                        : sub,
                                )

                                setTask({ ...task, submissions: updatedSubmissions })
                                setSelectedSubmission({ ...selectedSubmission, grade, feedback, isGraded: true })
                            }}
                        />
                    </TabsContent>
                )}
            </Tabs>
        </div>
    )
}
