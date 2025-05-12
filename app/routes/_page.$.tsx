import { Button } from "~/components/ui/button";

export default function NotFoundPage() {
    return (
        <div className="w-full h-screen flex items-center justify-center">
            <div className="max-w-xl flex flex-col items-center gap-4">
                <h1 className="text-6xl font-bold">
                    404
                </h1>
                <p>
                    This page could not be found.
                </p>
                <Button>
                    Go Back to Home
                </Button>
            </div>
        </div>
    )
}