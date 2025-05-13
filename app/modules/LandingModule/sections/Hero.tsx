import { Link } from "react-router";
import { Button } from "~/components/ui/button";

export default function Hero() {
    return (
        <section className="py-20 md:py-32">
            <div className="w-full px-4 md:px-6 flex items-center justify-center gap-10">
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
                        <Link to={'/auth'} className="w-full">
                            <Button className="w-full">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="mx-auto lg:mx-0 relative">
                    <img
                        src="/hero-asset.webp"
                        width={400}
                        height={400}
                        alt="EduVate Hero Image"
                    />
                </div>
            </div>
        </section>
    )
}