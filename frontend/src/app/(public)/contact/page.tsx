"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";

const formSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    subject: z.string().min(5, {
        message: "Subject must be at least 5 characters.",
    }),
    message: z.string().min(10, {
        message: "Message must be at least 10 characters.",
    }),
});

export default function ContactPage() {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: "",
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // In a real app, this would send data to the backend
        console.log(values);
        toast.success("Message sent!", {
            description: "We'll get back to you as soon as possible."
        });
        form.reset();
    }

    return (
        <div className="container py-20 px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12">
                {/* Contact Information */}
                <div className="space-y-8">
                    <div>
                        <h1 className="font-heading text-4xl font-bold mb-4">Get in Touch</h1>
                        <p className="text-muted-foreground text-lg">
                            Have questions about our coaching programs? We're here to help. Fill out the form or reach out directly.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-start space-x-4">
                            <MapPin className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold text-lg">Our Office</h3>
                                <p className="text-muted-foreground">
                                    123 Growth Avenue, Suite 400<br />
                                    New York, NY 10001
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <Mail className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold text-lg">Email</h3>
                                <p className="text-muted-foreground">hello@servicepro.com</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-4">
                            <Phone className="h-6 w-6 text-primary mt-1" />
                            <div>
                                <h3 className="font-semibold text-lg">Phone</h3>
                                <p className="text-muted-foreground">+1 (555) 123-4567</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <Card className="border-border/50 shadow-lg">
                    <CardHeader>
                        <CardTitle>Send a Message</CardTitle>
                        <CardDescription>
                            We typically respond within 24 hours.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="john@example.com" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="subject"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Subject</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Consulting Inquiry" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="message"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Message</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell us about yourself and what you're looking for..."
                                                    className="min-h-[120px]"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <Button type="submit" className="w-full">
                                    Send Message
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
