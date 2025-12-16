import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <DashboardLayout role="user">
            {children}
        </DashboardLayout>
    );
}
