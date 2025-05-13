import { BookOpen, FileText, MessageSquare, Mic } from "lucide-react";

export default function Features() {
    return (
        <section id="features" className="py-16 md:py-24 bg-violet-50">
            <div className="w-full px-10 md:px-20">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                        <p className="max-w-[900px] text-neutral-100 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                            EduVate offers a comprehensive set of features designed to make learning accessible and engaging for
                            students with visual impairments.
                        </p>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
                    <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md bg-violet-400">
                        <div className="rounded-full bg-violet-100 p-4">
                            <Mic className="h-6 w-6 text-violet-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Voice Navigation</h3>
                        <p className="text-center text-neutral-100">
                            Navigate through the app, access content, and complete quizzes using simple voice commands.
                        </p>
                    </div>
                    <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md bg-violet-400">
                        <div className="rounded-full bg-violet-100 p-4">
                            <FileText className="h-6 w-6 text-violet-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white">PDF Reader</h3>
                        <p className="text-center text-neutral-100">
                            Convert PDF documents into audio content, making textbooks and learning materials accessible.
                        </p>
                    </div>
                    <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md bg-violet-400">
                        <div className="rounded-full bg-violet-100 p-4">
                            <MessageSquare className="h-6 w-6 text-violet-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Interactive Quizzes</h3>
                        <p className="text-center text-neutral-100">
                            Complete quizzes and assessments using voice responses, with immediate audio feedback.
                        </p>
                    </div>
                    <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md bg-violet-400">
                        <div className="rounded-full bg-violet-100 p-4">
                            <BookOpen className="h-6 w-6 text-violet-600" />
                        </div>
                        <h3 className="text-xl font-bold text-white">Learning Materials</h3>
                        <p className="text-center text-neutral-100">
                            Access a library of accessible learning materials, organized by subject and grade level.
                        </p>
                    </div>
                    <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md bg-violet-400">
                        <div className="rounded-full bg-violet-100 p-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-6 w-6 text-violet-600"
                            >
                                <path d="M14 19a6 6 0 0 0-12 0"></path>
                                <circle cx="8" cy="9" r="4"></circle>
                                <path d="M22 19a6 6 0 0 0-6-6 4 4 0 1 0 0-8"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white">Teacher Dashboard</h3>
                        <p className="text-center text-neutral-100">
                            Create and manage accessible content, track student progress, and provide personalized support.
                        </p>
                    </div>
                    <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md bg-violet-400">
                        <div className="rounded-full bg-violet-100 p-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-6 w-6 text-violet-600"
                            >
                                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white">Accessibility First</h3>
                        <p className="text-center text-neutral-100">
                            Built from the ground up with accessibility as the primary focus, ensuring a seamless experience.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    )
}