"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { api } from "@/lib/api";
import type { Booking, Service, User } from "@/types";

export default function BookingManagerPage() {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    const fetchData = async () => {
        try {
            const [bookingsData, servicesData] = await Promise.all([
                api.bookings.getAll(),
                api.services.getAll()
            ]);
            setBookings(bookingsData);
            setServices(servicesData);
        } catch (error) {
            toast.error("Failed to load bookings");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStatusChange = async (id: number, newStatus: 'confirmed' | 'cancelled') => {
        try {
            await api.bookings.updateStatus(id, { status: newStatus });
            toast.success(`Booking ${newStatus}`);
            fetchData();
        } catch (error) {
            toast.error("Failed to update booking status", {
                description: error instanceof Error ? error.message : "Could not update booking"
            });
        }
    };

    const getServiceById = (serviceId: number) => {
        return services.find(s => s.id === serviceId);
    };

    const filteredBookings = filter === "all"
        ? bookings
        : bookings.filter(b => b.status === filter);

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
                    <h2 className="font-heading text-3xl font-bold tracking-tight">Bookings</h2>
                    <p className="text-muted-foreground">Manage and track your client sessions.</p>
                </div>
                <div className="w-[180px]">
                    <Select value={filter} onValueChange={setFilter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Filter Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Booking ID</TableHead>
                            <TableHead>User ID</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBookings.length > 0 ? (
                            filteredBookings.map((booking) => {
                                const service = getServiceById(booking.service_id);
                                return (
                                    <TableRow key={booking.id}>
                                        <TableCell className="font-medium">#{booking.id}</TableCell>
                                        <TableCell>User #{booking.user_id}</TableCell>
                                        <TableCell>{service?.name || 'Unknown Service'}</TableCell>
                                        <TableCell>
                                            {format(new Date(booking.booking_date), "MMM dd, yyyy")} at {booking.start_time}
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={
                                                booking.status === 'confirmed' ? 'default' :
                                                    booking.status === 'pending' ? 'secondary' : 'destructive'
                                            }>
                                                {booking.status.toUpperCase()}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {booking.status === 'pending' && (
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        size="sm"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => handleStatusChange(booking.id, 'confirmed')}
                                                    >
                                                        <Check className="h-4 w-4 mr-1" /> Approve
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => handleStatusChange(booking.id, 'cancelled')}
                                                    >
                                                        <X className="h-4 w-4 mr-1" /> Decline
                                                    </Button>
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                                    No bookings found
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
