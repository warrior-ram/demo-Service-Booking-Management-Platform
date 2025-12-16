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
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";


// Mock Data
const INITIAL_BOOKINGS = [
    { id: 1, client: "John Doe", service: "Consulting Session", date: "Oct 24, 10:00 AM", status: "pending" },
    { id: 2, client: "Jane Smith", service: "Mock Interview", date: "Oct 25, 02:00 PM", status: "confirmed" },
    { id: 3, client: "Bob Wilson", service: "Resume Review", date: "Oct 26, 11:00 AM", status: "cancelled" },
];

export default function BookingManagerPage() {
    const [bookings, setBookings] = useState(INITIAL_BOOKINGS);
    const [filter, setFilter] = useState("all");

    const handleStatusChange = (id: number, newStatus: string) => {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: newStatus } : b));
        toast.success(`Booking marked as ${newStatus}`);
    };

    const filteredBookings = filter === "all"
        ? bookings
        : bookings.filter(b => b.status === filter);

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
                            <TableHead>Client</TableHead>
                            <TableHead>Service</TableHead>
                            <TableHead>Date & Time</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredBookings.map((booking) => (
                            <TableRow key={booking.id}>
                                <TableCell className="font-medium">{booking.client}</TableCell>
                                <TableCell>{booking.service}</TableCell>
                                <TableCell>{booking.date}</TableCell>
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
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
