//client/src/app/(dashboard)/admin/layout.tsx
import { DashboardLayout } from './components/DashboardLayout';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
