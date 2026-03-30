//client\src\app\(dashboard)\warden-dashboard\components\outpass\StudentProfileCard.tsx
export default function StudentProfileCard({ student }: any) {
  if (!student) {
    return (
      <div className="
        w-full lg:w-72
        border border-slate-200 rounded-2xl
        p-4 bg-white
        text-[13px] text-slate-500
      ">
        Select a student
      </div>
    )
  }

  return (
    <div className="
      w-full lg:w-72
      border border-slate-200 rounded-2xl
      p-4 bg-white
    ">

      <div className="text-sm font-semibold text-slate-900">
        {student.name}
      </div>

      <div className="text-xs text-slate-500 mt-1 break-all">
        {student.email}
      </div>

      <div className="text-xs text-slate-500 mt-1">
        {student.enrollmentNumber
          ? `Enrollment · ${student.enrollmentNumber}`
          : "No enrollment"}
      </div>

    </div>
  )
}

