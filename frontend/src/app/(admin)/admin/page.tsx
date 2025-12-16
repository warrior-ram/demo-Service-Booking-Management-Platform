import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, Calendar, Activity } from "lucide-react";

export default function AdminDashboardPage() {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="font-heading text-3xl font-bold tracking-tight">Admin Dashboard</h2>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatsCard
                    title="Total Revenue"
                    value="$12,350"
                    icon={<DollarSign className="h-4 w-4 text-muted-foreground" />}
                    description="+20.1% from last month"
                />
                <StatsCard
                    title="Active Bookings"
                    value="+45"
                    icon={<Calendar className="h-4 w-4 text-muted-foreground" />}
                    description="+180.1% from last month"
                />
                <StatsCard
                    title="New Clients"
                    value="+122"
                    icon={<Users className="h-4 w-4 text-muted-foreground" />}
                    description="+19% from last month"
                />
                <StatsCard
                    title="Active Services"
                    value="3"
                    icon={<Activity className="h-4 w-4 text-muted-foreground" />}
                    description="Currently offered"
                />
            </div>

            {/* Recent Activity */}
            <Card>
                <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-8">
                        {/* Mock Activity List */}
                        <div className="flex items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">New booking: 1-on-1 Strategy</p>
                                <p className="text-sm text-muted-foreground">Sarah Johnson booked for tomorrow at 10 AM</p>
                            </div>
                            <div className="ml-auto font-medium">+$150.00</div>
                        </div>
                        <div className="flex items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">New Account Created</p>
                                <p className="text-sm text-muted-foreground">mike.ross@example.com joined</p>
                            </div>
                            <div className="ml-auto font-medium">2 min ago</div>
                        </div>
                        <div className="flex items-center">
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">Meeting Completed</p>
                                <p className="text-sm text-muted-foreground">Mock Interview with Emily</p>
                            </div>
                            <div className="ml-auto font-medium text-green-500">Completed</div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function StatsCard({ title, value, icon, description }: { title: string; value: string; icon: React.ReactNode; description?: string }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                    {title}
                </CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="text-xs text-muted-foreground">{description}</p>}
            </CardContent>
        </Card>
    )
}
