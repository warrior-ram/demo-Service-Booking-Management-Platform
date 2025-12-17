"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MoreVertical, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Booking, Service } from "@/types";
import { toast } from "sonner";

export default function UserDashboard() {
    const router = useRouter();
    const { user } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [bookingsData, servicesData] = await Promise.all([
                    api.bookings.getAll(),
                    api.services.getAll()
                ]);
                setBookings(bookingsData);
                setServices(servicesData);
            } catch (error) {
                toast.error("Failed to load dashboard data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getServiceById = (serviceId: number) => {
        return services.find(s => s.id === serviceId);
    };

    const stats = {
        total: bookings.length,
        upcoming: bookings.filter(b => b.status === 'confirmed' || b.status === 'pending').length,
        completed: bookings.filter(b => b.status === 'confirmed' && new Date(b.booking_date) < new Date()).length,
        totalSpent: bookings.reduce((sum, b) => {
            const service = getServiceById(b.service_id);
            return sum + (service?.price || 0);
        }, 0)
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
                    <h2 className="font-heading text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Welcome back, {user?.full_name}! Here are your upcoming sessions.</p>
                </div>
                <Button onClick={() => router.push('/book')}>New Booking</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total Bookings" value={stats.total.toString()} />
                <StatsCard title="Upcoming" value={stats.upcoming.toString()} />
                <StatsCard title="Completed" value={stats.completed.toString()} />
                <StatsCard title="Total Spent" value={`$${stats.totalSpent.toFixed(2)}`} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>
                        You have {bookings.filter(b => b.status === 'confirmed').length} confirmed upcoming sessions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {bookings.length > 0 ? (
                        <div className="space-y-4">
                            {bookings.map((booking) => {
                                const service = getServiceById(booking.service_id);
                                return (
                                    <div
                                        key={booking.id}
                                        className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                                    >
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold">{service?.name || 'Unknown Service'}</span>
                                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    {format(new Date(booking.booking_date), "MMM dd, yyyy")}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {booking.start_time}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <Badge variant={booking.status === 'confirmed' ? 'default' : booking.status === 'pending' ? 'secondary' : 'destructive'}>
                                                {booking.status}
                                            </Badge>
                                            <span className="font-medium text-sm">${service?.price || 0}</span>
                                            <Button variant="ghost" size="icon">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-12 text-muted-foreground">
                            <p className="mb-4">No bookings yet</p>
                            <Button onClick={() => router.push('/book')}>Book Your First Session</Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function StatsCard({ title, value }: { title: string; value: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
            </CardContent>
        </Card>
    )
}
