import { BookOpen, FileText, MessageSquare, Mic } from "lucide-react"
import { Link } from "react-router"
import { Button } from "~/components/ui/button"

export default function LandingModule() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <section className="py-20 md:py-32 bg-gradient-to-b from-white to-violet-50">
          <div className="w-full px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="rounded-lg bg-violet-100 px-3 py-1 text-sm text-violet-800 w-fit">
                  Empowering Education for All
                </div>
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Learning Without Barriers
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-lg">
                  EduVate makes education accessible for students with visual impairments through voice-guided
                  navigation, audio content delivery, and interactive learning experiences.
                </p>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link to={'/auth'}>
                    <Button className="bg-violet-600 hover:bg-violet-700">
                      Get Started
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mx-auto lg:mx-0 relative">
                <img
                  src="/eduvate-mascot.png"
                  width={550}
                  height={550}
                  alt="EduVate Mascot"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="py-16 md:py-24">
          <div className="w-full px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About EduVate</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  EduVate is an innovative educational platform designed specifically for students with visual
                  impairments. Our mission is to make learning accessible, engaging, and effective for all students,
                  regardless of visual ability.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <img
                src="/placeholder.svg?height=400&width=400"
                width={400}
                height={400}
                alt="Teacher using EduVate to create accessible content"
                className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full"
              />
              <div className="flex flex-col justify-center space-y-4">
                <ul className="grid gap-6">
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">For Students</h3>
                      <p className="text-muted-foreground">
                        EduVate provides voice-guided navigation, audio content delivery, and interactive quizzes that
                        can be completed using voice commands.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">For Teachers</h3>
                      <p className="text-muted-foreground">
                        Create accessible learning materials, design voice-navigable quizzes, and monitor student
                        progress with our intuitive teacher dashboard.
                      </p>
                    </div>
                  </li>
                  <li>
                    <div className="grid gap-1">
                      <h3 className="text-xl font-bold">Our Vision</h3>
                      <p className="text-muted-foreground">
                        We believe that education should be accessible to everyone. Our goal is to remove barriers to
                        learning and create equal opportunities for all students.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24 bg-violet-50">
          <div className="w-full px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Key Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  EduVate offers a comprehensive set of features designed to make learning accessible and engaging for
                  students with visual impairments.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-violet-100 p-4">
                  <Mic className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold">Voice Navigation</h3>
                <p className="text-center text-muted-foreground">
                  Navigate through the app, access content, and complete quizzes using simple voice commands.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-violet-100 p-4">
                  <FileText className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold">PDF Reader</h3>
                <p className="text-center text-muted-foreground">
                  Convert PDF documents into audio content, making textbooks and learning materials accessible.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-violet-100 p-4">
                  <MessageSquare className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold">Interactive Quizzes</h3>
                <p className="text-center text-muted-foreground">
                  Complete quizzes and assessments using voice responses, with immediate audio feedback.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
                <div className="rounded-full bg-violet-100 p-4">
                  <BookOpen className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold">Learning Materials</h3>
                <p className="text-center text-muted-foreground">
                  Access a library of accessible learning materials, organized by subject and grade level.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
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
                <h3 className="text-xl font-bold">Teacher Dashboard</h3>
                <p className="text-center text-muted-foreground">
                  Create and manage accessible content, track student progress, and provide personalized support.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm transition-all hover:shadow-md">
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
                <h3 className="text-xl font-bold">Accessibility First</h3>
                <p className="text-center text-muted-foreground">
                  Built from the ground up with accessibility as the primary focus, ensuring a seamless experience.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-violet-600 text-white px-10 md:px-20">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Transform Education?
              </h2>
              <p className="max-w-[600px] opacity-90 md:text-xl">
                Join thousands of students and teachers who are already using EduVate to make education more
                accessible and engaging.
              </p>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link to={'/auth'}>
                  <Button className="bg-white text-violet-600 hover:bg-violet-100">
                    Get Started Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
