import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, DollarSign } from "lucide-react";

// Mock Data
const SERVICES = [
    {
        id: "consulting-1h",
        title: "1-on-1 Career Strategy",
        description: "Deep dive into your career goals, roadblocks, and actionable next steps.",
        price: 150,
        duration: "60 min",
        features: ["Personalized Roadmap", "Resume Audit", "Follow-up Action Plan"],
        popular: true,
    },
    {
        id: "mock-interview",
        title: "Mock Interview Session",
        description: "Practice with real-world scenarios and get detailed feedback to ace your next interview.",
        price: 120,
        duration: "45 min",
        features: ["Behavioral Setup", "Technical Questions", "Video Recording"],
        popular: false,
    },
    {
        id: "resume-review",
        title: "Resume Overhaul",
        description: "Expert review of your resume and LinkedIn profile to stand out to recruiters.",
        price: 99,
        duration: "Async",
        features: ["ATS Optimization", "Formatting Fixes", "LinkedIn Headline Rewrite"],
        popular: false,
    },
    {
        id: "leadership-workshop",
        title: "Leadership Workshop",
        description: "Group session focused on developing core leadership and management skills.",
        price: 300,
        duration: "3 hours",
        features: ["Group Exercises", "Case Studies", "Networking"],
        popular: false,
    },
    {
        id: "monthly-retainer",
        title: "Executive Coaching Retainer",
        description: "Ongoing support for senior leaders looking to make a massive impact.",
        price: 800,
        duration: "Monthly",
        features: ["Weekly 1-on-1s", "Unlimited Email Support", "Priority Scheduling"],
        popular: false,
    },
];

export default function ServicesPage() {
    return (
        <div className="container py-12 md:py-20">
            <div className="mx-auto max-w-2xl text-center mb-16">
                <h1 className="font-heading text-4xl font-bold tracking-tight sm:text-5xl mb-4">
                    Invest solely in <span className="text-primary">Yourself</span>
                </h1>
                <p className="text-muted-foreground text-lg">
                    Select the perfect coaching package to accelerate your professional growth.
                </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {SERVICES.map((service) => (
                    <Card key={service.id} className={`flex flex-col relative ${service.popular ? 'border-primary shadow-lg scale-105 z-10' : 'border-border'}`}>
                        {service.popular && (
                            <Badge className="absolute top-0 right-0 -mt-3 -mr-3 px-3 py-1 text-sm">
                                Most Popular
                            </Badge>
                        )}
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">{service.title}</CardTitle>
                            <CardDescription className="h-12">{service.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="flex items-baseline mb-6">
                                <span className="text-3xl font-bold">${service.price}</span>
                                <span className="text-muted-foreground ml-2">/ {service.duration}</span>
                            </div>
                            <ul className="space-y-3">
                                {service.features.map((feature) => (
                                    <li key={feature} className="flex items-center text-sm text-muted-foreground">
                                        <Check className="mr-2 h-4 w-4 text-primary" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" asChild>
                                {/* For now, just link to a generic book page or login, we'll build booking flow later */}
                                <Link href={`/book?serviceId=${service.id}`}>Book Now</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
