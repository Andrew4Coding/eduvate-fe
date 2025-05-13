import type React from "react"

import { useState } from "react"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs"
import { Textarea } from "~/components/ui/textarea"
import { ArrowLeft, Pencil, Save, User, School, BookOpen, UserCog } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar"
import { redirect, useLoaderData, useNavigate, type LoaderFunctionArgs } from "react-router"
import { authClient } from "~/lib/auth-client"
import prisma from "prisma/prisma"

export async function loader(args: LoaderFunctionArgs) {
    const session = await authClient.getSession({
        fetchOptions: {
            headers: {
                Cookie: args.request.headers.get('Cookie') || '',
            },
        }
    })

    const user = session.data?.user;

    if (!user) {
        return redirect('/auth')
    }

    let userData;
    if (user.role === 'student') {
        userData = await prisma.student.findFirst({
            where: {
                id: user.id,
            },
        });
    } else {
        userData = await prisma.teacher.findFirst({
            where: {
                id: user.id,
            },
        });
    }

    return {
        ...user,
        ...userData
    };
}

export default function ProfilePage() {
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const loaderData: {
        id: string
        name: string
        email: string
        role: string
        schoolName: string
        schoolCode: string
        bio: string
        joinedDate: string
        courses: string[]
    } = useLoaderData();

    console.log("loaderData", loaderData);


    // Mock user data - replace with actual data fetching
    const [userData, setUserData] = useState({
        id: "user-123",
        name: "Jane Doe",
        email: "jane.doe@example.com",
        role: "student", // "student", "teacher", or "admin"
        schoolName: "Example High School",
        schoolCode: "EHS2023",
        bio: "I'm a passionate student interested in mathematics and science.",
        joinedDate: "January 2023",
        courses: ["Mathematics", "Physics", "Computer Science"],
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setUserData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            // TODO: Implement actual profile update logic here
            console.log("Profile update submitted:", userData)

            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1000))

            setIsEditing(false)
        } catch (error) {
            console.error("Profile update failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    const getRoleIcon = () => {
        switch (userData.role) {
            case "student":
                return <BookOpen className="h-5 w-5 text-purple-600" />
            case "teacher":
                return <School className="h-5 w-5 text-purple-600" />
            case "admin":
                return <UserCog className="h-5 w-5 text-purple-600" />
            default:
                return <User className="h-5 w-5 text-purple-600" />
        }
    }

    const getRoleTitle = () => {
        switch (userData.role) {
            case "student":
                return "Student"
            case "teacher":
                return "Teacher"
            case "admin":
                return "School Administrator"
            default:
                return "User"
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center overflow-hidden py-8">
            <div className="w-full px-10 md:px-20">
                <div className="mb-6 flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold ml-2">My Profile</h1>
                </div>
            </div>
        </div>
    )
}
