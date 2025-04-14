import { Download, FileArchive, FileText } from "lucide-react"
import { Button } from "~/components/ui/button"

interface TaskAttachmentsListProps {
    attachments: any[]
}

export default function TaskAttachmentsList({ attachments }: TaskAttachmentsListProps) {
    if (attachments.length === 0) {
        return (
            <div className="text-center py-4">
                <p className="text-sm text-muted-foreground">No attachments available</p>
            </div>
        )
    }

    const getFileIcon = (fileType: string) => {
        switch (fileType.toUpperCase()) {
            case "PDF":
                return <FileText className="h-4 w-4" />
            case "ZIP":
                return <FileArchive className="h-4 w-4" />
            default:
                return <FileText className="h-4 w-4" />
        }
    }

    return (
        <div className="space-y-2">
            {attachments.map((attachment) => (
                <div
                    key={attachment.id}
                    className="flex items-center justify-between p-2 rounded-md border bg-card text-card-foreground hover:bg-accent/50 transition-colors"
                >
                    <div className="flex items-center gap-2">
                        {getFileIcon(attachment.fileType)}
                        <div>
                            <p className="text-sm font-medium">{attachment.name}</p>
                            {attachment.description && <p className="text-xs text-muted-foreground">{attachment.description}</p>}
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                        <a href={attachment.fileUrl} download>
                            <Download className="h-4 w-4" />
                            <span className="sr-only">Download {attachment.name}</span>
                        </a>
                    </Button>
                </div>
            ))}
        </div>
    )
}
