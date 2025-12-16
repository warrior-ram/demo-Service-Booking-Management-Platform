import { BookingFlow } from "@/components/booking/BookingFlow";

export default function BookingPage() {
    return (
        <div className="container py-20 px-4 md:px-6">
            <div className="mx-auto max-w-4xl">
                <div className="mb-10 text-center">
                    <h1 className="font-heading text-3xl font-bold mb-4">Book Your Session</h1>
                    <p className="text-muted-foreground">
                        Take the next step in your professional journey. Select a time that works for you.
                    </p>
                </div>
                <BookingFlow />
            </div>
        </div>
    );
}
