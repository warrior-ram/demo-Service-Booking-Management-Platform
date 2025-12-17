"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";

export default function ProfilePage() {
    const { user, loading } = useAuth();

    if (loading) {
        return <div className="flex justify-center py-20">Loading...</div>;
    }

    if (!user) {
        return <div className="flex justify-center py-20">Please log in to view your profile.</div>;
    }

    const initials = user.full_name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    return (
        <div className="space-y-8">
            <div>
                <h2 className="font-heading text-3xl font-bold tracking-tight">Profile</h2>
                <p className="text-muted-foreground">Manage your account information.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                        <CardDescription>Your basic account details.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-lg font-semibold">{user.full_name}</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Full Name</Label>
                                <Input value={user.full_name} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label>Email</Label>
                                <Input value={user.email} disabled />
                            </div>
                            <div className="space-y-2">
                                <Label>Role</Label>
                                <Input value={user.role} disabled className="capitalize" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Account Status</CardTitle>
                        <CardDescription>Your account activity and status.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">Account Status</span>
                            <span className={`font-medium ${user.is_active ? "text-green-600" : "text-red-600"}`}>
                                {user.is_active ? "Active" : "Inactive"}
                            </span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b">
                            <span className="text-muted-foreground">User ID</span>
                            <span className="font-mono text-sm">{user.id}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
