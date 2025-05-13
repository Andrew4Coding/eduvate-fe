export default function AboutUs() {
    return (
        <section id="about" className="py-16 md:py-24">
            <div className="w-full px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">About EduVate</h2>
                        <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-lg/relaxed">
                            EduVate is an innovative educational platform designed specifically for students with visual
                            impairments. Our mission is to make learning accessible, engaging, and effective for all students,
                            regardless of visual ability.
                        </p>
                    </div>
                </div>
                <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
                    <img
                        src="https://d3t35pgnsskh52.cloudfront.net/uploads/conversions/56169_Annie%20banner-responsive.png"
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
    )
}