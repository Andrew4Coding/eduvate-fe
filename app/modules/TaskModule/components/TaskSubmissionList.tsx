import { format } from "date-fns"
import { FileText, CheckCircle, Clock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"

interface TaskSubmissionsListProps {
    submissions: any[]
    onSelect: (submission: any) => void
    isTeacher: boolean
}

export default function TaskSubmissionsList({ submissions, onSelect, isTeacher }: TaskSubmissionsListProps) {
    if (submissions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <FileText className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="font-medium">No submissions yet</h3>
                <p className="text-sm text-muted-foreground">
                    {isTeacher ? "Students haven't submitted any work yet." : "You haven't submitted any work for this task yet."}
                </p>
            </div>
        )
    }

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    {isTeacher && <TableHead>Student</TableHead>}
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    {isTeacher && <TableHead>Grade</TableHead>}
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                        {isTeacher && <TableCell className="font-medium">{submission.studentName}</TableCell>}
                        <TableCell>{format(new Date(submission.createdAt), "MMM d, yyyy 'at' h:mm a")}</TableCell>
                        <TableCell>
                            {submission.isGraded ? (
                                <Badge variant="outline" className="bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                                    <CheckCircle className="h-3 w-3" /> Graded
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="bg-amber-100 text-amber-800 flex items-center gap-1 w-fit">
                                    <Clock className="h-3 w-3" /> Pending
                                </Badge>
                            )}
                        </TableCell>
                        {isTeacher && <TableCell>{submission.isGraded ? submission.grade : "-"}</TableCell>}
                        <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => onSelect(submission)}>
                                View
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
