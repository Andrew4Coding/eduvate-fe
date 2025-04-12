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
            include: {
                school: true,
            },
        });
    } else if (user.role === 'teacher') {
        userData = await prisma.teacher.findFirst({
            where: {
                id: user.id,
            },
            include: {
                school: true,
            },
        });
    } else if (user.role === 'admin') {
        userData = await prisma.admin.findFirst({
            where: {
                id: user.id,
            },
            include: {
                school: true,
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
        <div className="min-h-screen flex flex-col items-center justify-center bg-white overflow-hidden py-8">
            {/* Decorative elements */}
            <img src="/home-bg.png" alt="" className="fixed w-screen h-screen z-0 object-cover opacity-50" />

            <div className="w-full max-w-4xl px-4">
                <div className="mb-6 flex items-center">
                    <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <h1 className="text-2xl font-bold ml-2">My Profile</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Profile Summary Card */}
                    <Card className="md:col-span-1 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader className="text-center pb-2">
                            <div className="flex justify-center mb-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src="/placeholder.svg?height=96&width=96" alt={userData.name} />
                                    <AvatarFallback className="text-2xl bg-purple-100 text-purple-700">
                                        {userData.name
                                            .split(" ")
                                            .map((n) => n[0])
                                            .join("")}
                                    </AvatarFallback>
                                </Avatar>
                            </div>
                            <CardTitle className="text-xl">{userData.name}</CardTitle>
                            <div className="flex items-center justify-center mt-1 text-sm text-gray-600">
                                {getRoleIcon()}
                                <span className="ml-1">{getRoleTitle()}</span>
                            </div>
                        </CardHeader>
                        <CardContent className="text-center">
                            <div className="space-y-2 text-sm">
                                <p className="text-gray-600">{userData.email}</p>
                                <p className="text-gray-600">{userData.schoolName}</p>
                                <p className="text-gray-500">Member since {userData.joinedDate}</p>
                            </div>

                            <div className="mt-6 space-y-4">
                                <Button
                                    variant="outline"
                                    className="w-full border-purple-300 hover:bg-purple-50"
                                    onClick={() => setIsEditing(!isEditing)}
                                >
                                    {isEditing ? (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Done Editing
                                        </>
                                    ) : (
                                        <>
                                            <Pencil className="mr-2 h-4 w-4" />
                                            Edit Profile
                                        </>
                                    )}
                                </Button>
                                <Button
                                    className="w-full"
                                    variant="destructive"
                                    onClick={async () => {
                                        await authClient.signOut({
                                            fetchOptions: {
                                                onSuccess: () => {
                                                    navigate('/auth')
                                                }
                                            }
                                        })
                                    }}
                                >
                                    Sign Out
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Profile Details Card */}
                    <Card className="md:col-span-2 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Profile Details</CardTitle>
                            <CardDescription>View and manage your profile information</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="personal" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="personal">Personal</TabsTrigger>
                                    <TabsTrigger value="academic">Academic</TabsTrigger>
                                    <TabsTrigger value="settings">Settings</TabsTrigger>
                                </TabsList>

                                <TabsContent value="personal" className="space-y-4 pt-4">
                                    <form onSubmit={handleSubmit}>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="name">Full Name</Label>
                                                    <Input
                                                        id="name"
                                                        name="name"
                                                        value={userData.name}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="email">Email</Label>
                                                    <Input
                                                        id="email"
                                                        name="email"
                                                        type="email"
                                                        value={userData.email}
                                                        onChange={handleChange}
                                                        disabled={!isEditing}
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="bio">Bio</Label>
                                                <Textarea
                                                    id="bio"
                                                    name="bio"
                                                    rows={4}
                                                    value={userData.bio}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    className="resize-none"
                                                />
                                            </div>

                                            {isEditing && (
                                                <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                                                    {isLoading ? "Saving Changes..." : "Save Changes"}
                                                </Button>
                                            )}
                                        </div>
                                    </form>
                                </TabsContent>

                                <TabsContent value="academic" className="pt-4">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label>School</Label>
                                            <div className="p-3 bg-gray-50 rounded-md">
                                                <p className="font-medium">{userData.schoolName}</p>
                                                <p className="text-sm text-gray-500">School Code: {userData.schoolCode}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label>Enrolled Courses</Label>
                                            <div className="grid grid-cols-1 gap-2">
                                                {userData.courses.map((course, index) => (
                                                    <div key={index} className="p-3 bg-purple-50 rounded-md">
                                                        <p className="font-medium text-purple-700">{course}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </TabsContent>

                                <TabsContent value="settings" className="pt-4">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="current-password">Current Password</Label>
                                            <Input id="current-password" type="password" placeholder="••••••••" disabled={!isEditing} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="new-password">New Password</Label>
                                            <Input id="new-password" type="password" placeholder="••••••••" disabled={!isEditing} />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-password">Confirm New Password</Label>
                                            <Input id="confirm-password" type="password" placeholder="••••••••" disabled={!isEditing} />
                                        </div>

                                        {isEditing && (
                                            <Button type="button" className="w-full bg-purple-600 hover:bg-purple-700">
                                                Update Password
                                            </Button>
                                        )}

                                        <div className="pt-4 border-t mt-6">
                                            <Button variant="destructive" className="w-full" disabled={!isEditing}>
                                                Delete Account
                                            </Button>
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
