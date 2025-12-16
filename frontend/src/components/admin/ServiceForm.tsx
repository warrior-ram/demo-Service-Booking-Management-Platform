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

const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    price: z.number().min(1, "Price must be greater than 0"),
    duration: z.string().min(1, "Duration is required"),
});

export function ServiceForm({ onSubmit }: { onSubmit: (values: any) => void }) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
            price: 0,
            duration: "60 min",
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Service Name</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Career Consultation" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Describe the service..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price ($)</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        placeholder="100"
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. 60 min" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <Button type="submit" className="w-full">
                    Save Service
                </Button>
            </form>
        </Form>
    );
}
