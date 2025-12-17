"use client";

import { useState, useEffect } from "react";
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
import { Edit, Plus, Trash, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import type { Service } from "@/types";
import { toast } from "sonner";

export default function ServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [editingService, setEditingService] = useState<Service | null>(null);

    const fetchServices = async () => {
        try {
            const data = await api.services.getAll();
            setServices(data);
        } catch (error) {
            toast.error("Failed to load services");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchServices();
    }, []);

    const handleAddService = async (values: any) => {
        try {
            await api.services.create(values);
            toast.success("Service created successfully");
            setOpen(false);
            fetchServices();
        } catch (error) {
            toast.error("Failed to create service", {
                description: error instanceof Error ? error.message : "Could not create service"
            });
        }
    };

    const handleUpdateService = async (values: any) => {
        if (!editingService) return;

        try {
            await api.services.update(editingService.id, values);
            toast.success("Service updated successfully");
            setEditingService(null);
            setOpen(false);
            fetchServices();
        } catch (error) {
            toast.error("Failed to update service", {
                description: error instanceof Error ? error.message : "Could not update service"
            });
        }
    };

    const handleDeleteService = async (id: number) => {
        if (!confirm("Are you sure you want to delete this service?")) return;

        try {
            await api.services.delete(id);
            toast.success("Service deleted successfully");
            fetchServices();
        } catch (error) {
            toast.error("Failed to delete service", {
                description: error instanceof Error ? error.message : "Could not delete service"
            });
        }
    };

    const handleToggleActive = async (service: Service) => {
        try {
            await api.services.update(service.id, { is_active: !service.is_active });
            toast.success(`Service ${service.is_active ? 'deactivated' : 'activated'}`);
            fetchServices();
        } catch (error) {
            toast.error("Failed to update service status");
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-heading text-3xl font-bold tracking-tight">Services</h2>
                    <p className="text-muted-foreground">Manage your coaching packages.</p>
                </div>

                <Dialog open={open} onOpenChange={(isOpen) => {
                    setOpen(isOpen);
                    if (!isOpen) setEditingService(null);
                }}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Service
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editingService ? 'Edit Service' : 'Add New Service'}</DialogTitle>
                            <DialogDescription>
                                {editingService ? 'Update the service details.' : 'Create a new service offering for your clients.'}
                            </DialogDescription>
                        </DialogHeader>
                        <ServiceForm
                            onSubmit={editingService ? handleUpdateService : handleAddService}
                            initialData={editingService ? {
                                name: editingService.name,
                                description: editingService.description || '',
                                price: editingService.price,
                                duration_minutes: editingService.duration_minutes
                            } : undefined}
                        />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Service Name</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {services.length > 0 ? (
                            services.map((service) => (
                                <TableRow key={service.id}>
                                    <TableCell className="font-medium">{service.name}</TableCell>
                                    <TableCell className="max-w-xs truncate">{service.description || '-'}</TableCell>
                                    <TableCell>${service.price}</TableCell>
                                    <TableCell>{service.duration_minutes} min</TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={service.is_active ? "default" : "secondary"}
                                            className="cursor-pointer"
                                            onClick={() => handleToggleActive(service)}
                                        >
                                            {service.is_active ? "Active" : "Inactive"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => {
                                                    setEditingService(service);
                                                    setOpen(true);
                                                }}
                                            >
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-destructive hover:text-destructive"
                                                onClick={() => handleDeleteService(service.id)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No services found. Create your first service to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
