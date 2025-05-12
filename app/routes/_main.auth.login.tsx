import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { useState } from "react"
import { Link, useNavigate } from "react-router"
import { toast } from "sonner"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { authClient } from "~/lib/auth-client"

export default function LoginPage() {
    const navigate = useNavigate()
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
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
            await authClient.signIn.email({
                email: formData.email,
                password: formData.password,
            }, {
                onSuccess: async () => {
                    toast.success("Login successful!")
                    navigate("/dashboard")
                },
                onError: (error) => {
                    toast.error("Login failed. Please check your credentials.")
                },
            })

        } catch (error) {
            console.error("Login failed:", error)
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
                    <CardTitle className="text-2xl font-bold text-gray-800 w-full">Login</CardTitle>
                </div>
                <CardDescription className="text-gray-600">Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
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
                        {isLoading ? "Logging in..." : "Login"}
                    </Button>
                </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2">
                <div className="text-sm text-center">
                    <Link to="/forgot-password" className="text-purple-600 hover:underline">
                        Forgot your password?
                    </Link>
                </div>
                <div className="text-sm text-center">
                    Don&apos;t have an account?{" "}
                    <Link to="/auth" className="text-purple-600 hover:underline">
                        Register
                    </Link>
                </div>
            </CardFooter>
        </Card>
    )
}
