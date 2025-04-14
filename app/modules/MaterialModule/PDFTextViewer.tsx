import { useRef } from "react"

interface PDFTextViewProps {
    pdfText: Array<{
        page: number
        content: string
    }>
    currentTime: number
    transcript: Array<{
        id: string
        start: number
        end: number
        text: string
    }>
}

export default function PDFTextView({ pdfText, currentTime, transcript }: PDFTextViewProps) {
    const containerRef = useRef<HTMLDivElement>(null)

    // Find the current transcript segment based on playback time
    const currentSegment = transcript.find((segment) => currentTime >= segment.start && currentTime <= segment.end)

    // Highlight text that matches the current transcript segment
    const highlightCurrentText = (text: string) => {
        if (!currentSegment) return text

        // Simple highlighting - in a real app, you'd use more sophisticated text matching
        // This is a simplified approach that looks for the exact transcript text in the PDF content
        const segmentText = currentSegment.text

        if (text.includes(segmentText)) {
            const parts = text.split(segmentText)
            return (
                <>
                    {parts[0]}
                    <span className="bg-primary/20 text-primary-foreground px-1 rounded">{segmentText}</span>
                    {parts.slice(1).join(segmentText)}
                </>
            )
        }

        return text
    }

    if (pdfText.length === 0) {
        return (
            <div className="flex items-center justify-center h-[500px] bg-muted/10 p-6">
                <p className="text-muted-foreground">No text content available for this document.</p>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className="h-[600px] overflow-y-auto bg-muted/10 p-6"
            tabIndex={0}
            aria-label="Document text content"
        >
            {pdfText.map((page) => (
                <div key={page.page} className="mb-8">
                    <h2 className="text-sm font-medium text-muted-foreground mb-2">Page {page.page}</h2>
                    <div className="space-y-4">
                        {page.content.split("\n\n").map((paragraph, idx) => (
                            <p key={idx} className="whitespace-pre-wrap">
                                {highlightCurrentText(paragraph)}
                            </p>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}
