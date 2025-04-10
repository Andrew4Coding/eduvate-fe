import {
    Atom,
    BarChart3,
    BookOpen,
    BookText,
    DollarSign,
    Dumbbell,
    Globe,
    Languages,
    Music,
    Palette,
    Plus,
    Smile,
} from "lucide-react"
import type React from "react"
import { useState } from "react"
import { Link } from "react-router"
import { Badge } from "~/components/ui/badge"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"

// Define the interface for course data
interface Course {
    id: string
    name: string
    code: string
    shortCode: string
    type: CourseType
    progress: number
    teacher: string
    description: string
    totalLessons: number
    completedLessons: number
}

// Define course types with their associated colors and icons
type CourseType =
    | "sociology"
    | "geography"
    | "english"
    | "mathematics"
    | "economics"
    | "history"
    | "science"
    | "art"
    | "music"
    | "physical_education"
    | "statistics"

// Define course type configurations
const courseTypeConfig: Record<
    CourseType,
    { color: string; bgColor: string; icon: React.ReactNode; label: string }
> = {
    sociology: {
        color: "bg-purple-500",
        bgColor: "bg-purple-100",
        icon: <Smile className="h-8 w-8 text-white" />,
        label: "Sosiologi",
    },
    geography: {
        color: "bg-green-500",
        bgColor: "bg-green-100",
        icon: <Globe className="h-8 w-8 text-white" />,
        label: "Geografi",
    },
    english: {
        color: "bg-indigo-500",
        bgColor: "bg-indigo-100",
        icon: <Languages className="h-8 w-8 text-white" />,
        label: "B. Inggris",
    },
    mathematics: {
        color: "bg-yellow-500",
        bgColor: "bg-yellow-100",
        icon: <Plus className="h-8 w-8 text-white" />,
        label: "Matematika",
    },
    economics: {
        color: "bg-blue-400",
        bgColor: "bg-blue-100",
        icon: <DollarSign className="h-8 w-8 text-white" />,
        label: "Ekonomi",
    },
    history: {
        color: "bg-red-400",
        bgColor: "bg-red-100",
        icon: <BookText className="h-8 w-8 text-white" />,
        label: "Sejarah",
    },
    science: {
        color: "bg-teal-500",
        bgColor: "bg-teal-100",
        icon: <Atom className="h-8 w-8 text-white" />,
        label: "Sains",
    },
    statistics: {
        color: "bg-violet-500",
        bgColor: "bg-violet-100",
        icon: <BarChart3 className="h-8 w-8 text-white" />,
        label: "Statistik",
    },
    music: {
        color: "bg-pink-500",
        bgColor: "bg-pink-100",
        icon: <Music className="h-8 w-8 text-white" />,
        label: "Musik",
    },
    art: {
        color: "bg-amber-500",
        bgColor: "bg-amber-100",
        icon: <Palette className="h-8 w-8 text-white" />,
        label: "Seni",
    },
    physical_education: {
        color: "bg-emerald-500",
        bgColor: "bg-emerald-100",
        icon: <Dumbbell className="h-8 w-8 text-white" />,
        label: "Pendidikan Jasmani",
    },
}

// Dummy data to simulate API response
const dummyCourses: Course[] = [
    {
        id: "course-1",
        name: "Sosiologi",
        code: "SOS101",
        shortCode: "SOSIO",
        type: "sociology",
        progress: 50,
        teacher: "Dr. Anita Wijaya",
        description: "Pengantar ilmu sosiologi dan pemahaman masyarakat modern",
        totalLessons: 24,
        completedLessons: 12,
    },
    {
        id: "course-2",
        name: "Geografi",
        code: "GEO201",
        shortCode: "GEOGR",
        type: "geography",
        progress: 50,
        teacher: "Prof. Budi Santoso",
        description: "Studi tentang bumi dan fenomena alam",
        totalLessons: 20,
        completedLessons: 10,
    },
    {
        id: "course-3",
        name: "B. Inggris",
        code: "ENG101",
        shortCode: "ENGLS",
        type: "english",
        progress: 50,
        teacher: "Mrs. Sarah Johnson",
        description: "Bahasa Inggris dasar untuk komunikasi internasional",
        totalLessons: 30,
        completedLessons: 15,
    },
    {
        id: "course-4",
        name: "Matematika",
        code: "MAT202",
        shortCode: "MATHS",
        type: "mathematics",
        progress: 25,
        teacher: "Dr. Ahmad Fauzi",
        description: "Aljabar, geometri, dan kalkulus dasar",
        totalLessons: 28,
        completedLessons: 7,
    },
    {
        id: "course-5",
        name: "Ekonomi",
        code: "ECO301",
        shortCode: "ECONO",
        type: "economics",
        progress: 50,
        teacher: "Prof. Dewi Kartika",
        description: "Prinsip dasar ekonomi mikro dan makro",
        totalLessons: 22,
        completedLessons: 11,
    },
    {
        id: "course-6",
        name: "Sejarah",
        code: "HIS101",
        shortCode: "HISTO",
        type: "history",
        progress: 75,
        teacher: "Dr. Hendra Wijaya",
        description: "Sejarah Indonesia dan dunia",
        totalLessons: 24,
        completedLessons: 18,
    },
]

export default function CoursesPage() {
    const [courses] = useState<Course[]>(dummyCourses)

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* Decorative elements */}
            <div
                className="absolute"
            >
                <div className="top-0 right-0 w-64 h-64 bg-purple-200 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-70"></div>
                <div className="bottom-0 left-0 w-64 h-64 bg-purple-200 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-70"></div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Mata Pelajaran</h1>
                    <Button asChild variant="ghost" size="icon">
                        <Link to="/dashboard">
                            <BookOpen className="h-5 w-5" />
                        </Link>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {courses.map((course) => {
                        const config = courseTypeConfig[course.type]

                        return (
                            <div
                                key={course.id}
                                className={cn('rounded-xl p-6 shadow-md relative overflow-hidden transition-transform hover:scale-[1.02]', config.color)}
                            >
                                <div className="mb-6">
                                    <div className="flex justify-between text-white mb-1">
                                        <span className="text-sm font-medium">{course.progress}%</span>
                                        <span className="text-sm font-medium">{course.completedLessons}/{course.totalLessons} Pelajaran</span>
                                    </div>
                                    <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-white rounded-full"
                                            style={{ width: `${course.progress}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div className='p-3 rounded-xl mr-4'>
                                        {config.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 space-y-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-white">{course.name}</h3>
                                            <Badge className="bg-white/20 text-white hover:bg-white/30">
                                                {course.shortCode}
                                            </Badge>
                                        </div>

                                        <Button
                                            asChild
                                            className="w-full bg-white text-black hover:bg-gray-200"
                                        >
                                            <Link to={`/courses/${course.id}`}>Lihat Detail</Link>
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
