export default function Footer() {
    return (
        <footer id="contact" className="border-t bg-background">
            <div className="w-full px-4 py-12 md:px-6 md:py-16">
                <div className="flex flex-col items-center">
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-center items-center gap-2">
                            <img
                                src="/eduvate-icon.png"
                                alt="EduVate Logo"
                                className="h-8 w-8 rounded-full"
                            />
                            <span className="text-xl font-bold">EduVate</span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Making education accessible for all students, regardless of visual ability.
                        </p>
                        <p className="text-xs text-muted-foreground text-center">© {new Date().getFullYear()} EduVate. All rights reserved.</p>

                    </div>
                </div>
            </div>
        </footer>
    )
}