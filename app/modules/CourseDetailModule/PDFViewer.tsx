import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Search } from "lucide-react"

interface PDFViewerProps {
    fileUrl: string
    extractedText?: string
}

export default function PDFViewer({ fileUrl, extractedText }: PDFViewerProps) {
    const [searchTerm, setSearchTerm] = useState("")
    const [showTextView, setShowTextView] = useState(false)

    // Function to highlight search terms in the text
    const highlightSearchTerm = (text: string, term: string) => {
        if (!term.trim()) return text

        const regex = new RegExp(`(${term})`, "gi")
        return text.split(regex).map((part, i) =>
            regex.test(part) ? (
                <mark key={i} className="bg-yellow-200">
                    {part}
                </mark>
            ) : (
                part
            ),
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {extractedText && (
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => setShowTextView(!showTextView)}>
                            {showTextView ? "Show PDF" : "Show Text"}
                        </Button>

                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search in document..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                disabled={!showTextView}
                            />
                        </div>
                    </div>

                    {showTextView && (
                        <div className="border rounded-md p-4 max-h-[500px] overflow-y-auto bg-white">
                            <div className="whitespace-pre-wrap font-mono text-sm">
                                {searchTerm ? highlightSearchTerm(extractedText, searchTerm) : extractedText}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {(!showTextView || !extractedText) && (
                <iframe src={fileUrl} className="w-full h-[600px] border rounded-md" title="PDF Viewer" />
            )}
        </div>
    )
}
