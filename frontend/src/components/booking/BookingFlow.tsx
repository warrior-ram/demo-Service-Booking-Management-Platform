"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CalendarIcon, Clock, Check } from "lucide-react";

// Mock Services
const SERVICES = [
    { id: "consulting-1h", name: "1-on-1 Career Strategy (1 hr)", price: 150 },
    { id: "mock-interview", name: "Mock Interview (45 min)", price: 120 },
    { id: "resume-review", name: "Resume Overhaul", price: 99 },
];

// Mock Time Slots
const TIME_SLOTS = [
    "09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"
];

export function BookingFlow() {
    const [step, setStep] = useState(1);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [serviceId, setServiceId] = useState<string>("");
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

    const selectedService = SERVICES.find(s => s.id === serviceId);

    const handleBook = () => {
        // Logic to submit booking to backend
        toast.success("Booking Confirmed!", {
            description: `You are booked for ${selectedService?.name} on ${date ? format(date, "PPP") : ""} at ${selectedSlot}.`
        });
        // Reset or redirect
        setTimeout(() => {
            window.location.href = "/dashboard";
        }, 1500);
    };

    return (
        <div className="grid md:grid-cols-2 gap-8 items-start">
            {/* Selection Area */}
            <Card className="border-border shadow-md">
                <CardHeader>
                    <CardTitle>Book Your Session</CardTitle>
                    <CardDescription>Select a service, date, and time.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Step 1: Service */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">1. Choose Service</label>
                        <Select onValueChange={setServiceId} defaultValue={serviceId}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a service..." />
                            </SelectTrigger>
                            <SelectContent>
                                {SERVICES.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>
                                        {s.name} - ${s.price}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Step 2: Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-medium">2. Pick a Date</label>
                        <div className="border rounded-md p-2 flex justify-center">
                            <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                disabled={(date) => date < new Date() || date.getDay() === 0 || date.getDay() === 6}
                                className="rounded-md border-none shadow-none"
                            />
                        </div>
                    </div>

                    {/* Step 3: Time */}
                    {date && serviceId && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium">3. Available Times</label>
                            <div className="grid grid-cols-3 gap-2">
                                {TIME_SLOTS.map((slot) => (
                                    <Button
                                        key={slot}
                                        variant={selectedSlot === slot ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setSelectedSlot(slot)}
                                        className={selectedSlot === slot ? "bg-primary text-primary-foreground" : ""}
                                    >
                                        {slot}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Summary Area */}
            <Card className="bg-muted/30 border-none">
                <CardHeader>
                    <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {selectedService ? (
                        <div className="space-y-2">
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="font-medium">Service</span>
                                <span>{selectedService.name}</span>
                            </div>
                            <div className="flex justify-between items-center border-b pb-2">
                                <span className="font-medium">Price</span>
                                <span>${selectedService.price}</span>
                            </div>
                            {date && (
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="font-medium">Date</span>
                                    <span className="flex items-center text-muted-foreground">
                                        <CalendarIcon className="w-4 h-4 mr-1" />
                                        {format(date, "PPP")}
                                    </span>
                                </div>
                            )}
                            {selectedSlot && (
                                <div className="flex justify-between items-center border-b pb-2">
                                    <span className="font-medium">Time</span>
                                    <span className="flex items-center text-muted-foreground">
                                        <Clock className="w-4 h-4 mr-1" />
                                        {selectedSlot}
                                    </span>
                                </div>
                            )}

                            <div className="pt-4">
                                <Button
                                    size="lg"
                                    className="w-full"
                                    disabled={!selectedService || !date || !selectedSlot}
                                    onClick={handleBook}
                                >
                                    <Check className="w-4 h-4 mr-2" />
                                    Confirm Booking
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-40 text-muted-foreground text-sm">
                            <Clock className="w-10 h-10 mb-2 opacity-20" />
                            Please select a service...
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
