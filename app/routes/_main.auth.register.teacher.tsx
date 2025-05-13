import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { data, Link, useLoaderData, useNavigate, useRouteLoaderData, type LoaderFunctionArgs } from "react-router"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { authClient } from "~/lib/auth-client"
import { fetchClient } from "~/lib/fetch"

export default function TeacherRegisterPage() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            await authClient.signUp.email({
                email: formData.email,
                name: formData.name,
                password: formData.password,
            }, {
                onSuccess: async () => {
                    const response = await fetchClient('/api/user/register-teacher', {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json",
                        },
                        body: JSON.stringify({
                            email: formData.email,
                        }),
                    })

                    if (response.statusText !== "OK") {
                        toast.error(response.data.message)

                        await authClient.deleteUser({
                            password: formData.password,
                        })

                        return
                    }
                    toast.success("Registration successful! Please login to your account.")

                    navigate('/auth/login')
                },
                onError: (error) => {
                    console.error("Error during sign-up:", error.error.message)
                    toast.error("Registration failed: " + error.error.message)
                }
            })
        } catch (error) {
            console.error("Registration failed:", error)
        } finally {
            setIsLoading(false)
        }
    }

    return (

        <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
                <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="absolute left-4" onClick={() => navigate("/auth")}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <CardTitle className="text-2xl font-bold text-gray-800 w-full">Teacher Registration</CardTitle>
                </div>
                <CardDescription className="text-gray-600">Create your teacher account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </Button>
                        </div>
                    </div>
                    <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                        {isLoading ? "Registering..." : "Register as Teacher"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex justify-center">
                <div className="text-sm text-center">
                    Already have an account?{" "}
                    <Link to="/auth/login" className="text-purple-600 hover:underline">
                        Login
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
