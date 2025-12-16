import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
    LogOut,
    Menu
} from "lucide-react"

interface DashboardLayoutProps {
    children: React.ReactNode
    role?: "admin" | "user"
}

export function DashboardLayout({ children, role = "user" }: DashboardLayoutProps) {
    const links = role === "admin"
        ? [
            { name: "Overview", href: "/admin", icon: LayoutDashboard },
            { name: "Bookings", href: "/admin/bookings", icon: Calendar },
            { name: "Services", href: "/admin/services", icon: Settings }, // improved icon
            { name: "Clients", href: "/admin/clients", icon: Users },
        ]
        : [
            { name: "My Bookings", href: "/dashboard", icon: Calendar },
            { name: "Profile", href: "/dashboard/profile", icon: Users },
            { name: "Settings", href: "/dashboard/settings", icon: Settings },
        ]

    return (
        <div className="min-h-screen bg-muted/20">
            {/* Sidebar - Desktop */}
            <aside className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r bg-card transition-transform md:block">
                <div className="flex h-16 items-center border-b px-6">
                    <Link href="/" className="flex items-center gap-2 font-heading text-lg font-bold text-primary">
                        ServicePro
                    </Link>
                </div>
                <div className="flex flex-col gap-2 px-4 py-6">
                    {links.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                            <link.icon className="h-4 w-4" />
                            {link.name}
                        </Link>
                    ))}
                </div>
                <div className="absolute bottom-4 left-0 w-full px-4">
                    <Button variant="ghost" className="w-full justify-start gap-3 text-red-500 hover:bg-red-50 hover:text-red-600" asChild>
                        <Link href="/logout">
                            <LogOut className="h-4 w-4" />
                            Log out
                        </Link>
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="md:pl-64">
                {/* Mobile Header */}
                <header className="sticky top-0 z-40 flex h-16 items-center border-b bg-background/95 px-6 backdrop-blur md:hidden">
                    <Button variant="ghost" size="icon" className="-ml-2">
                        <Menu className="h-5 w-5" />
                    </Button>
                    <span className="ml-4 font-heading font-bold">Dashboard</span>
                </header>

                <div className="container p-6 md:p-10">
                    {children}
                </div>
            </main>
        </div>
    )
}
