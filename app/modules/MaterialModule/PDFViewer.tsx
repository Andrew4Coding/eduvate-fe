"use client"

import type React from "react"

import { useState } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { ChevronLeft, ChevronRight, Search, ZoomIn, ZoomOut, File } from "lucide-react"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"
import "react-pdf/dist/esm/Page/TextLayer.css"

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`

interface PDFViewerProps {
    fileUrl: string
    totalPages: number
}

export default function PDFViewer({ fileUrl, totalPages }: PDFViewerProps) {
    const [numPages, setNumPages] = useState<number | null>(null)
    const [pageNumber, setPageNumber] = useState(1)
    const [scale, setScale] = useState(1)
    const [searchText, setSearchText] = useState("")
    const [isSearching, setIsSearching] = useState(false)

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages)
    }

    const goToPrevPage = () => {
        setPageNumber((prev) => Math.max(prev - 1, 1))
    }

    const goToNextPage = () => {
        setPageNumber((prev) => Math.min(prev + 1, numPages || totalPages))
    }

    const zoomIn = () => {
        setScale((prev) => Math.min(prev + 0.2, 2.5))
    }

    const zoomOut = () => {
        setScale((prev) => Math.max(prev - 0.2, 0.5))
    }

    const handlePageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const page = Number.parseInt(e.target.value)
        if (!isNaN(page) && page >= 1 && page <= (numPages || totalPages)) {
            setPageNumber(page)
        }
    }

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-2 border-b bg-muted/30">
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={goToPrevPage}
                        disabled={pageNumber <= 1}
                        aria-label="Previous page"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="flex items-center gap-1">
                        <Input
                            type="number"
                            min={1}
                            max={numPages || totalPages}
                            value={pageNumber}
                            onChange={handlePageChange}
                            className="w-14 h-8 text-center"
                            aria-label={`Page ${pageNumber} of ${numPages || totalPages}`}
                        />
                        <span className="text-sm text-muted-foreground">/ {numPages || totalPages}</span>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={goToNextPage}
                        disabled={pageNumber >= (numPages || totalPages)}
                        aria-label="Next page"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={zoomOut} disabled={scale <= 0.5} aria-label="Zoom out">
                        <ZoomOut className="h-4 w-4" />
                    </Button>
                    <span className="text-sm">{Math.round(scale * 100)}%</span>
                    <Button variant="ghost" size="icon" onClick={zoomIn} disabled={scale >= 2.5} aria-label="Zoom in">
                        <ZoomIn className="h-4 w-4" />
                    </Button>
                </div>

                <div className="relative hidden sm:block">
                    <Search className="h-4 w-4 absolute left-2 top-2 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search..."
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        className="w-40 h-8 pl-8"
                        aria-label="Search document"
                    />
                </div>
            </div>

            <div
                className="flex-1 overflow-auto bg-muted/20 flex justify-center p-4"
                role="region"
                aria-label="PDF document viewer"
            >
                <Document
                    file={fileUrl}
                    onLoadSuccess={onDocumentLoadSuccess}
                    loading={
                        <div className="flex items-center justify-center h-full">
                            <div className="animate-pulse text-center">
                                <div className="h-32 w-24 bg-muted rounded-sm mx-auto mb-4"></div>
                                <p className="text-sm text-muted-foreground">Loading PDF...</p>
                            </div>
                        </div>
                    }
                    error={
                        <div className="flex items-center justify-center h-full text-center">
                            <div>
                                <File className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                                <p className="font-medium">Failed to load PDF</p>
                                <p className="text-sm text-muted-foreground">
                                    Please check if the file exists or try downloading it instead.
                                </p>
                            </div>
                        </div>
                    }
                    externalLinkTarget="_blank"
                >
                    <Page
                        pageNumber={pageNumber}
                        scale={scale}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        className="shadow-md"
                        inputRef={(ref) => {
                            if (ref) {
                                // Add ARIA attributes to the canvas element
                                const canvas = ref.querySelector("canvas")
                                if (canvas) {
                                    canvas.setAttribute("role", "img")
                                    canvas.setAttribute("aria-label", `PDF page ${pageNumber}`)
                                }
                            }
                        }}
                    />
                </Document>
            </div>
        </div>
    )
}
