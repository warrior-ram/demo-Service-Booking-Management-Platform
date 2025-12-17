"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { CalendarIcon, Clock, Check, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { Service, TimeSlot } from "@/types";

export function BookingFlow() {
    const router = useRouter();
    const { user } = useAuth();
    const [services, setServices] = useState<Service[]>([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [date, setDate] = useState<Date | undefined>(new Date());
    const [serviceId, setServiceId] = useState<string>("");
    const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const selectedService = services.find(s => s.id === parseInt(serviceId));

    // Fetch services on mount
    useEffect(() => {
        const fetchServices = async () => {
            try {
                const data = await api.services.getAll();
                // Filter only active services
                setServices(data.filter(s => s.is_active));
            } catch (error) {
                toast.error("Failed to load services");
            } finally {
                setLoadingServices(false);
            }
        };

        fetchServices();
    }, []);

    // Fetch available slots when service and date are selected
    useEffect(() => {
        const fetchSlots = async () => {
            if (!serviceId || !date) {
                setAvailableSlots([]);
                setSelectedSlot(null);
                return;
            }

            setLoadingSlots(true);
            try {
                const formattedDate = format(date, "yyyy-MM-dd");
                const data = await api.availability.getSlots(parseInt(serviceId), formattedDate);
                setAvailableSlots(data.available_slots);
                setSelectedSlot(null); // Reset selected slot when date/service changes
            } catch (error) {
                toast.error("Failed to load available time slots");
                setAvailableSlots([]);
            } finally {
                setLoadingSlots(false);
            }
        };

        fetchSlots();
    }, [serviceId, date]);

    const handleBook = async () => {
        if (!user) {
            toast.error("Please login to book a session");
            router.push('/login?redirect=/book');
            return;
        }

        if (!selectedService || !date || !selectedSlot) {
            toast.error("Please complete all booking details");
            return;
        }

        setSubmitting(true);
        try {
            const bookingData = {
                service_id: selectedService.id,
                booking_date: format(date, "yyyy-MM-dd"),
                start_time: selectedSlot.start_time,
            };

            await api.bookings.create(bookingData);

            toast.success("Booking Confirmed!", {
                description: `You are booked for ${selectedService.name} on ${format(date, "PPP")} at ${selectedSlot.start_time}.`
            });

            setTimeout(() => {
                router.push("/dashboard");
            }, 1500);
        } catch (error) {
            toast.error("Booking failed", {
                description: error instanceof Error ? error.message : "Could not complete booking"
            });
        } finally {
            setSubmitting(false);
        }
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
                        {loadingServices ? (
                            <div className="flex items-center justify-center py-4">
                                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                            </div>
                        ) : (
                            <Select onValueChange={setServiceId} value={serviceId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a service..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {services.map((s) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            {s.name} - ${s.price}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
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
                            {loadingSlots ? (
                                <div className="flex items-center justify-center py-8">
                                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                                </div>
                            ) : availableSlots.length > 0 ? (
                                <div className="grid grid-cols-3 gap-2">
                                    {availableSlots.map((slot) => (
                                        <Button
                                            key={`${slot.start_time}-${slot.end_time}`}
                                            variant={selectedSlot?.start_time === slot.start_time ? "default" : "outline"}
                                            size="sm"
                                            onClick={() => setSelectedSlot(slot)}
                                            className={selectedSlot?.start_time === slot.start_time ? "bg-primary text-primary-foreground" : ""}
                                        >
                                            {slot.start_time}
                                        </Button>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8 text-muted-foreground text-sm">
                                    No available time slots for this date
                                </div>
                            )}
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
                                        {selectedSlot.start_time}
                                    </span>
                                </div>
                            )}

                            <div className="pt-4">
                                <Button
                                    size="lg"
                                    className="w-full"
                                    disabled={!selectedService || !date || !selectedSlot || submitting}
                                    onClick={handleBook}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4 mr-2" />
                                            Confirm Booking
                                        </>
                                    )}
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
