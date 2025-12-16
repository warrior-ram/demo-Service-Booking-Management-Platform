import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp, Users } from "lucide-react";

export default function Home() {
  return (
    <>
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-background py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-8 text-center">
              <div className="space-y-4 max-w-3xl">
                <h1 className="font-heading text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Unlock Your Potential with <span className="text-primary">Premium Coaching</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                  Expert guidance tailored to your goals. Book 1-on-1 sessions, join group workshops, and transform your career today.
                </p>
              </div>
              <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
                <Button size="lg" className="h-12 px-8 text-lg" asChild>
                  <Link href="/services">Book a Consultation</Link>
                </Button>
                <Button size="lg" variant="outline" className="h-12 px-8 text-lg" asChild>
                  <Link href="/about">Learn More</Link>
                </Button>
              </div>

              {/* Abstract decorative element (optional) */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[100px] rounded-full" />
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-secondary/30 py-20 lg:py-24">
          <div className="container px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Why Choose Us?</h2>
              <p className="mt-4 text-muted-foreground text-lg">We provide the tools and support you need to succeed.</p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<Calendar className="h-10 w-10 text-primary" />}
                title="Flexible Scheduling"
                description="Book sessions that fit your busy lifestyle. Real-time availability makes it easy."
              />
              <FeatureCard
                icon={<TrendingUp className="h-10 w-10 text-primary" />}
                title="Proven Results"
                description="Our data-driven approach ensures you make measurable progress towards your goals."
              />
              <FeatureCard
                icon={<Users className="h-10 w-10 text-primary" />}
                title="Community Support"
                description="Join a network of like-minded individuals committed to growth and excellence."
              />
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 lg:py-24">
          <div className="container px-4 md:px-6">
            <h2 className="mb-12 font-heading text-3xl font-bold tracking-tight sm:text-4xl text-center">What Our Clients Say</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              <TestimonialCard
                quote="The coaching sessions completely transformed my approach to leadership. Highly recommended!"
                author="Sarah J."
                role="CEO, TechStart"
              />
              <TestimonialCard
                quote="I've never felt more confident in my career path. The guidance is practical and actionable."
                author="Michael R."
                role="Product Manager"
              />
              <TestimonialCard
                quote="Booking seemsless, the platform is beautiful, and the results speak for themselves."
                author="Emily Chen"
                role="Creative Director"
              />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-primary/5 py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-6 text-center">
              <h2 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Ready to Start Your Journey?</h2>
              <p className="max-w-[600px] text-muted-foreground text-lg">
                Join hundreds of satisfied clients who have leveled up their lives.
              </p>
              <Button size="lg" className="h-12 px-8 text-lg bg-primary text-primary-foreground hover:bg-primary/90" asChild>
                <Link href="/signup">Get Started Now</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border-none shadow-md bg-card/50 backdrop-blur transition-all hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}

function TestimonialCard({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <Card className="border border-border/50 bg-card shadow-sm">
      <CardContent className="pt-6">
        <div className="mb-4">
          {[1, 2, 3, 4, 5].map((s) => (
            <span key={s} className="text-accent text-lg">★</span>
          ))}
        </div>
        <blockquote className="text-lg font-medium leading-relaxed mb-6">"{quote}"</blockquote>
        <div>
          <p className="font-semibold">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </CardContent>
    </Card>
  );
}
