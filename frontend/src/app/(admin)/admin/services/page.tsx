"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ServiceForm } from "@/components/admin/ServiceForm";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash } from "lucide-react";

// Mock Data
const INITIAL_SERVICES = [
    { id: 1, name: "Consulting Session", price: 150, duration: "60 mins" },
    { id: 2, name: "Mock Interview", price: 120, duration: "45 mins" },
];

export default function ServicesPage() {
    const [services, setServices] = useState(INITIAL_SERVICES);
    const [open, setOpen] = useState(false);

    const handleAddService = (values: any) => {
        const newService = {
            id: services.length + 1,
            name: values.name,
            price: values.price,
            duration: values.duration,
        };
        setServices([...services, newService]);
        setOpen(false);
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-heading text-3xl font-bold tracking-tight">Services</h2>
                    <p className="text-muted-foreground">Manage your coaching packages.</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Service
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add New Service</DialogTitle>
                            <DialogDescription>
                                Create a new service offering for your clients.
                            </DialogDescription>
                        </DialogHeader>
                        <ServiceForm onSubmit={handleAddService} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service Name</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.map((service) => (
                            <TableRow key={service.id}>
                                <TableCell className="font-medium">{service.name}</TableCell>
                                <TableCell>${service.price}</TableCell>
                                <TableCell>{service.duration}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="icon">
                                            <Edit className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
