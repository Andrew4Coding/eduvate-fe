import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "~/components/ui/card"

export default function Index() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white relative overflow-hidden font-jakarta">
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-200 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl opacity-70"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-200 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl opacity-70"></div>
            <div className="absolute top-20 left-20 w-32 h-32 bg-purple-200 rotate-45 transform origin-center opacity-60"></div>
            <div className="absolute bottom-20 right-20 w-32 h-32 bg-purple-200 rotate-45 transform origin-center opacity-60"></div>

            <Card className="w-full max-w-md shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                    <CardTitle className="text-3xl font-bold text-gray-800">Welcome to EduVate</CardTitle>
                    <CardDescription className="text-lg text-gray-600 font-medium">Sign in to continue</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center space-y-6">
                    <div className="w-32 min-h-32 rounded-full bg-purple-200 flex items-center justify-center">
                        <img
                            src="/eduvate-mascot.png"
                            alt="Brain mascot"
                            width={100}
                            height={100}
                            className="rounded-full"
                        />
                    </div>

                    <div className="w-full space-y-4">
                        <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                            <Link to="/auth/login">Login</Link>
                        </Button>

                        <div className="relative flex flex-col items-center py-2 font-medium">
                            <div className="flex-grow border-t border-gray-300"></div>
                            <span className="flex-shrink mx-4 text-gray-500">Or register as</span>
                            <div className="flex-grow border-t border-gray-300"></div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <Button asChild variant="outline" className="border-purple-300 hover:bg-purple-50">
                                <Link to="/auth/register/student">Student</Link>
                            </Button>
                            <Button asChild variant="outline" className="border-purple-300 hover:bg-purple-50">
                                <Link to="/auth/register/teacher">Teacher</Link>
                            </Button>
                            <Button asChild variant="outline" className="border-purple-300 hover:bg-purple-50">
                                <Link to="/auth/register/admin">Admin</Link>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
