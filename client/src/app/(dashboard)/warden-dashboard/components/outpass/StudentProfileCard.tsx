//client\src\app\(dashboard)\warden-dashboard\components\outpass\StudentProfileCard.tsx
export default function StudentProfileCard({ student }: any) {
  if (!student) {
    return <div className="w-72 border rounded-xl p-4 text-sm text-gray-500">Select a student</div>;
  }

  return (
    <div className="w-72 border rounded-xl p-4">
      <h3 className="font-semibold">{student.name}</h3>
      <p className="text-xs text-gray-500">{student.email}</p>
      <p className="text-xs text-gray-500">Enrollment: {student.enrollmentNumber || 'N/A'}</p>
    </div>
  );
}

