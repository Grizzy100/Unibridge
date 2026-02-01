//client\src\app\(dashboard)\student-dashboard\mail\layout.tsx
// client/src/app/(dashboard)/student-dashboard/mail/layout.tsx
import DashboardLayout from "../components/DashboardLayout"

export default function StudentMailLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <DashboardLayout>
      <div className="h-[calc(100vh-128px)] min-h-[680px]">
        {children}
      </div>
    </DashboardLayout>
  )
}


