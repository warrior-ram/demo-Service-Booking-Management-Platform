"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock, DollarSign } from "lucide-react";
import { useEffect, useState } from "react";
import { Service } from "@/types";
import { api } from "@/lib/api";
import { toast } from "sonner";

// Mock Data removed

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await api.services.getAll();
                setServices(data.filter(s => s.is_active));
            } catch (error) {
                toast.error("Failed to load services");
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    if (loading) {
        return <div className="container py-20 text-center">Loading services...</div>;
    }

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
                {services.map((service) => (
                    <Card key={service.id} className="flex flex-col relative border-border hover:border-primary transition-colors">
                        <CardHeader>
                            <CardTitle className="text-xl font-bold">{service.name}</CardTitle>
                            <CardDescription className="h-12 line-clamp-2">{service.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1">
                            <div className="flex items-baseline mb-6">
                                <span className="text-3xl font-bold">${service.price}</span>
                                <span className="text-muted-foreground ml-2">/ {service.duration_minutes} min</span>
                            </div>
                            {/* Features list would come from DB if added to schema, currently static/implied */}
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" asChild>
                                <Link href={`/book?serviceId=${service.id}`}>Book Now</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
