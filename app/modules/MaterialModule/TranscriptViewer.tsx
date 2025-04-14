import { useRef, useEffect } from "react"
import { Clock } from "lucide-react"

interface TranscriptSegment {
    id: string
    start: number
    end: number
    text: string
}

interface TranscriptViewerProps {
    transcript: TranscriptSegment[]
    activeId: string | null
    onSegmentClick: (start: number) => void
    autoScroll?: boolean
}

export default function TranscriptViewer({
    transcript,
    activeId,
    onSegmentClick,
    autoScroll = true,
}: TranscriptViewerProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const activeSegmentRef = useRef<HTMLDivElement>(null)

    // Scroll to active segment when it changes or autoScroll is enabled
    useEffect(() => {
        if (activeSegmentRef.current && containerRef.current && autoScroll) {
            const container = containerRef.current
            const activeElement = activeSegmentRef.current

            // Calculate position to scroll to (center the active element)
            const containerHeight = container.clientHeight
            const activeElementTop = activeElement.offsetTop
            const activeElementHeight = activeElement.clientHeight

            const scrollPosition = activeElementTop - containerHeight / 2 + activeElementHeight / 2

            container.scrollTo({
                top: scrollPosition,
                behavior: "smooth",
            })
        }
    }, [activeId, autoScroll])

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
    }

    if (transcript.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-10 text-center">
                <Clock className="h-10 w-10 text-muted-foreground mb-2" />
                <h3 className="font-medium">No transcript available</h3>
                <p className="text-sm text-muted-foreground">This material doesn't have a transcript yet.</p>
            </div>
        )
    }

    return (
        <div
            ref={containerRef}
            className="h-[400px] overflow-y-auto space-y-2 pr-2"
            tabIndex={0}
            aria-label="Audio transcript"
            role="region"
        >
            {transcript.map((segment) => (
                <div
                    key={segment.id}
                    ref={segment.id === activeId ? activeSegmentRef : null}
                    className={`
            p-3 rounded-md cursor-pointer transition-colors
            ${segment.id === activeId ? "bg-primary/10 border border-primary/20" : "hover:bg-muted"}
          `}
                    onClick={() => onSegmentClick(segment.start)}
                    tabIndex={0}
                    role="button"
                    aria-current={segment.id === activeId ? "true" : "false"}
                    aria-label={`Transcript segment from ${formatTime(segment.start)} to ${formatTime(segment.end)}`}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault()
                            onSegmentClick(segment.start)
                        }
                    }}
                >
                    <div className="flex justify-between items-center mb-1">
                        <span className="text-xs font-medium text-muted-foreground">
                            {formatTime(segment.start)} - {formatTime(segment.end)}
                        </span>
                        {segment.id === activeId && (
                            <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">Now Playing</span>
                        )}
                    </div>
                    <p className={`text-sm ${segment.id === activeId ? "font-medium" : ""}`}>{segment.text}</p>
                </div>
            ))}
        </div>
    )
}
