import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MoreVertical } from "lucide-react";

// Mock Data
const MY_BOOKINGS = [
    {
        id: "bk_1",
        service: "1-on-1 Career Strategy",
        date: "Oct 24, 2024",
        time: "10:00 AM",
        status: "confirmed",
        price: "$150",
    },
    {
        id: "bk_2",
        service: "Resume Overhaul",
        date: "Nov 02, 2024",
        time: "02:00 PM",
        status: "pending",
        price: "$99",
    },
];

export default function UserDashboard() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-heading text-3xl font-bold tracking-tight">Dashboard</h2>
                    <p className="text-muted-foreground">Welcome back! Here are your upcoming sessions.</p>
                </div>
                <Button>New Booking</Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard title="Total Bookings" value="12" />
                <StatsCard title="Upcoming" value="2" />
                <StatsCard title="Completed" value="10" />
                <StatsCard title="Total Spent" value="$1,450" />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Bookings</CardTitle>
                    <CardDescription>
                        You have {MY_BOOKINGS.filter(b => b.status === 'confirmed').length} confirmed upcoming sessions.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {MY_BOOKINGS.map((booking) => (
                            <div
                                key={booking.id}
                                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/50"
                            >
                                <div className="flex flex-col gap-1">
                                    <span className="font-semibold">{booking.service}</span>
                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {booking.date}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {booking.time}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <Badge variant={booking.status === 'confirmed' ? 'default' : 'secondary'}>
                                        {booking.status}
                                    </Badge>
                                    <span className="font-medium text-sm">{booking.price}</span>
                                    <Button variant="ghost" size="icon">
                                        <MoreVertical className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
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
