// client/src/app/(dashboard)/teacher-dashboard/mail/layout.tsx
export default function TeacherMailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-[calc(100vh-128px)] min-h-[680px]">
      {children}
    </div>
  )
}



