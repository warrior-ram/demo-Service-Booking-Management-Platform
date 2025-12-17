"use client";

import { useEffect, useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash, Clock } from "lucide-react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { Availability, AvailabilityCreate } from "@/types";

const DAYS = [
    "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
];

export default function AvailabilityPage() {
    const [rules, setRules] = useState<Availability[]>([]);
    const [loading, setLoading] = useState(true);
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form State
    const [formData, setFormData] = useState<AvailabilityCreate>({
        day_of_week: 0,
        start_time: "09:00",
        end_time: "17:00",
        is_blocked: false
    });

    const fetchRules = async () => {
        try {
            const data = await api.availability.getRules();
            // Sort by day and then start time
            const sorted = data.sort((a, b) => {
                if (a.day_of_week !== b.day_of_week) return a.day_of_week - b.day_of_week;
                return a.start_time.localeCompare(b.start_time);
            });
            setRules(sorted);
        } catch (error) {
            toast.error("Failed to fetch availability rules");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRules();
    }, []);

    const handleDelete = async (id: number) => {
        try {
            await api.availability.deleteRule(id);
            setRules(rules.filter(r => r.id !== id));
            toast.success("Rule deleted");
        } catch (error) {
            toast.error("Failed to delete rule");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            // Ensure seconds are included if input type="time" omits them, though API might handle HH:MM
            // Pydantic time usually accepts HH:MM:SS or HH:MM
            const payload = {
                ...formData,
                start_time: formData.start_time.length === 5 ? `${formData.start_time}:00` : formData.start_time,
                end_time: formData.end_time.length === 5 ? `${formData.end_time}:00` : formData.end_time,
            };

            const newRule = await api.availability.createRule(payload);
            setRules([...rules, newRule].sort((a, b) => a.day_of_week - b.day_of_week));
            setOpen(false);
            toast.success("Availability rule created");
        } catch (error: any) {
             toast.error(error.message || "Failed to create rule");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="font-heading text-3xl font-bold tracking-tight">Availability</h2>
                    <p className="text-muted-foreground">Manage your working hours and blocked slots.</p>
                </div>

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Add Rule
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Add Availability Rule</DialogTitle>
                            <DialogDescription>
                                Set a time range when you are available (or blocked) for a specific day.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label>Day of Week</Label>
                                <Select 
                                    value={formData.day_of_week.toString()} 
                                    onValueChange={(v) => setFormData({...formData, day_of_week: parseInt(v)})}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select day" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {DAYS.map((day, index) => (
                                            <SelectItem key={day} value={index.toString()}>
                                                {day}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Start Time</Label>
                                    <Input 
                                        type="time" 
                                        value={formData.start_time}
                                        onChange={(e) => setFormData({...formData, start_time: e.target.value})}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>End Time</Label>
                                    <Input 
                                        type="time" 
                                        value={formData.end_time}
                                        onChange={(e) => setFormData({...formData, end_time: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select 
                                    value={formData.is_blocked ? "blocked" : "available"} 
                                    onValueChange={(v) => setFormData({...formData, is_blocked: v === "blocked"})}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Available (Working Hours)</SelectItem>
                                        <SelectItem value="blocked">Blocked (Unavailable)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={submitting}>
                                    {submitting ? "Saving..." : "Save Rule"}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Day</TableHead>
                            <TableHead>Time Range</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center">
                                    Loading rules...
                                </TableCell>
                            </TableRow>
                        ) : rules.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No availability rules set. You won't appear as available for bookings.
                                </TableCell>
                            </TableRow>
                        ) : (
                            rules.map((rule) => (
                                <TableRow key={rule.id}>
                                    <TableCell className="font-medium">
                                        {DAYS[rule.day_of_week]}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center text-sm">
                                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {rule.start_time.slice(0, 5)} - {rule.end_time.slice(0, 5)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={rule.is_blocked ? "destructive" : "default"}>
                                            {rule.is_blocked ? "Blocked" : "Available"}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => handleDelete(rule.id)}
                                        >
                                            <Trash className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
