import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
    return (
        <footer className="w-full border-t border-border/40 bg-background text-sm">
            <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

                    {/* Brand & Description */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="font-heading text-xl font-bold tracking-tight text-primary">
                                ServicePro
                            </span>
                        </Link>
                        <p className="text-muted-foreground w-full max-w-xs">
                            Empowering your growth with premium coaching services. Book your session today and start your journey.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Services</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link href="/services/consulting" className="hover:text-primary">1-on-1 Consulting</Link></li>
                            <li><Link href="/services/group" className="hover:text-primary">Group Coaching</Link></li>
                            <li><Link href="/services/workshops" className="hover:text-primary">Workshops</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Company</h4>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-primary">Contact</Link></li>
                            <li><Link href="/careers" className="hover:text-primary">Careers</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-semibold text-foreground">Follow Us</h4>
                        <div className="flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Instagram className="h-5 w-5" />
                                <span className="sr-only">Instagram</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-primary">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-border/40 pt-8 text-center text-muted-foreground">
                    <p>© {new Date().getFullYear()} ServicePro. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
