import { Link } from "react-router"
import { Button } from "~/components/ui/button"
import AboutUs from "./sections/AboutUs"
import Hero from "./sections/Hero"
import Features from "./sections/Features"

export default function LandingModule() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <Hero />
        <AboutUs />
        <Features />
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
