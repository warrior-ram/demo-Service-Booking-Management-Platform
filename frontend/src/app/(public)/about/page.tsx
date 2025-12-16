import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Target, Award, Users } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="flex flex-col">
            {/* Hero Section */}
            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6">Empowering Your Growth</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        We believe that with the right guidance, everyone has the potential to achieve extraordinary results.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 container mx-auto px-4">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        {/* Placeholder for Coach Image */}
                        <div className="bg-muted w-full h-[400px] rounded-2xl flex items-center justify-center">
                            <span className="text-muted-foreground">Coach Image Placeholder</span>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <h2 className="font-heading text-3xl font-bold">Our Mission</h2>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Founded in 2024, ServicePro was born from a desire to bridge the gap between potential and performance. We specialize in providing high-impact coaching that is both strategic and empathetic.
                        </p>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            Our approach is data-driven yet human-centric, ensuring that you not only reach your goals but enjoy the journey getting there.
                        </p>
                        <div className="pt-4">
                            <div className="flex gap-4">
                                <Stat number="500+" label="Clients Coached" />
                                <Stat number="98%" label="Success Rate" />
                                <Stat number="50+" label="Corporate Partners" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 bg-primary/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="font-heading text-3xl font-bold">Our Core Values</h2>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        <ValueCard
                            icon={<Target className="h-10 w-10 text-primary" />}
                            title="Clarity"
                            description="We cut through the noise to focus on what truly matters for your success."
                        />
                        <ValueCard
                            icon={<Users className="h-10 w-10 text-primary" />}
                            title="Partnership"
                            description="We are not just coaches; we are partners in your long-term growth."
                        />
                        <ValueCard
                            icon={<Award className="h-10 w-10 text-primary" />}
                            title="Excellence"
                            description="We hold ourselves and our clients to the highest standards of performance."
                        />
                    </div>
                </div>
            </section>
        </div>
    );
}

function Stat({ number, label }: { number: string; label: string }) {
    return (
        <div>
            <div className="text-3xl font-bold text-primary">{number}</div>
            <div className="text-sm text-muted-foreground">{label}</div>
        </div>
    )
}

function ValueCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <Card className="bg-card border-none shadow-sm text-center p-6">
            <CardContent className="pt-6 flex flex-col items-center space-y-4">
                <div className="bg-primary/10 p-4 rounded-full">
                    {icon}
                </div>
                <h3 className="text-xl font-bold">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}
