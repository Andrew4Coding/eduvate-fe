import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"

export default function Index() {
    return (
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
                        <span className="flex-shrink mx-4 text-gray-500">Or register</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <Link to="/auth/register/student">
                            <Button variant="outline" className="border-purple-300 hover:bg-purple-50 w-full">
                                My Student
                            </Button>
                        </Link>
                        <Link to="/auth/register/teacher">
                            <Button variant="outline" className="border-purple-300 hover:bg-purple-50 w-full">
                                Me as Teacher
                            </Button>
                        </Link>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
