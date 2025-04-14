"use client"

import { useState } from "react"
import { format } from "date-fns"
import { FileText, Download, Clock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Textarea } from "~/components/ui/textarea"
import { Separator } from "~/components/ui/separator"

interface TaskSubmissionViewerProps {
    submission: any
    isTeacher: boolean
    onGrade: (grade: number, feedback: string) => void
}

export default function TaskSubmissionViewer({ submission, isTeacher, onGrade }: TaskSubmissionViewerProps) {
    const [grade, setGrade] = useState<number | undefined>(submission.grade)
    const [feedback, setFeedback] = useState<string>(submission.feedback || "")
    const [isEditing, setIsEditing] = useState(false)

    const handleSaveGrade = () => {
        if (grade !== undefined) {
            onGrade(grade, feedback)
            setIsEditing(false)
        }
    }

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Submission Details</CardTitle>
                            <CardDescription>Submitted on {format(new Date(submission.createdAt), "PPP 'at' p")}</CardDescription>
                        </div>
                        <Badge
                            variant="outline"
                            className={`
              flex items-center gap-1 w-fit
              ${submission.isGraded ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"}
            `}
                        >
                            {submission.isGraded ? (
                                <>
                                    <CheckCircle className="h-3 w-3" /> Graded
                                </>
                            ) : (
                                <>
                                    <Clock className="h-3 w-3" /> Pending
                                </>
                            )}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between p-4 rounded-md border bg-card text-card-foreground">
                        <div className="flex items-center gap-3">
                            <FileText className="h-8 w-8 text-primary" />
                            <div>
                                <p className="font-medium">Submission File</p>
                                <p className="text-sm text-muted-foreground">{submission.fileUrl.split("/").pop()}</p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm" className="gap-1" asChild>
                            <a href={submission.fileUrl} download>
                                <Download className="h-4 w-4" /> Download
                            </a>
                        </Button>
                    </div>

                    {/* PDF Viewer (mock) */}
                    <div className="border rounded-md overflow-hidden">
                        <div className="bg-muted p-2 flex items-center justify-between">
                            <p className="text-sm font-medium">Document Preview</p>
                            <Button variant="ghost" size="sm">
                                Open Full Screen
                            </Button>
                        </div>
                        <div className="aspect-video bg-accent/10 flex items-center justify-center">
                            <div className="text-center p-6">
                                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                <p className="font-medium">Document Preview</p>
                                <p className="text-sm text-muted-foreground">
                                    Preview not available. Please download the file to view.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Grading</CardTitle>
                        {isTeacher && !isEditing && (
                            <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                                {submission.isGraded ? "Edit Grade" : "Grade Submission"}
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {isTeacher && isEditing ? (
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="grade">Grade</Label>
                                <Input
                                    id="grade"
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={grade || ""}
                                    onChange={(e) => setGrade(Number.parseInt(e.target.value) || undefined)}
                                    placeholder="Enter grade (0-100)"
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="feedback">Feedback</Label>
                                <Textarea
                                    id="feedback"
                                    value={feedback}
                                    onChange={(e) => setFeedback(e.target.value)}
                                    placeholder="Provide feedback to the student..."
                                    rows={4}
                                />
                            </div>
                        </div>
                    ) : submission.isGraded ? (
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium mb-1">Grade</h3>
                                <p className="text-2xl font-bold">{submission.grade}/100</p>
                            </div>

                            <Separator />

                            <div>
                                <h3 className="text-sm font-medium mb-1">Feedback</h3>
                                <p className="text-sm">{submission.feedback || "No feedback provided."}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="py-8 text-center">
                            <Clock className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                            <h3 className="font-medium">Not Graded Yet</h3>
                            <p className="text-sm text-muted-foreground">This submission is waiting to be graded.</p>
                        </div>
                    )}
                </CardContent>
                {isTeacher && isEditing && (
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setIsEditing(false)}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveGrade} disabled={grade === undefined}>
                            Save Grade
                        </Button>
                    </CardFooter>
                )}
            </Card>
        </div>
    )
}
