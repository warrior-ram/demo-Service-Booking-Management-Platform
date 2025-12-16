"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    const navLinks = [
        { name: "Services", href: "/services" },
        { name: "About", href: "/about" },
        { name: "Contact", href: "/contact" },
    ];

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">

                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <span className="font-heading text-xl font-bold tracking-tight text-primary">
                            ServicePro
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>

                    {/* Auth Buttons (Desktop) */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        <Button variant="ghost" asChild>
                            <Link href="/login">Log in</Link>
                        </Button>
                        <Button asChild>
                            <Link href="/signup">Get Started</Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Toggle */}
                    <div className="md:hidden">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="border-b border-border/40 bg-background md:hidden">
                    <div className="space-y-4 px-4 py-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="block text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
                                onClick={() => setIsOpen(false)}
                            >
                                {link.name}
                            </Link>
                        ))}
                        <div className="pt-4 flex flex-col space-y-2">
                            <Button variant="outline" className="w-full" asChild onClick={() => setIsOpen(false)}>
                                <Link href="/login">Log in</Link>
                            </Button>
                            <Button className="w-full" asChild onClick={() => setIsOpen(false)}>
                                <Link href="/signup">Get Started</Link>
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
}
