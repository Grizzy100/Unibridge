//client/src/app/(dashboard)/admin/layout.tsx
import { DashboardLayout } from './components/DashboardLayout';
import ProtectedRoute from '../../../../components/ProtectedRoute';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProtectedRoute allowedRoles={["ADMIN"]} redirectTo="/admin-login" replace>
      <DashboardLayout>{children}</DashboardLayout>
    </ProtectedRoute>
  );
}
