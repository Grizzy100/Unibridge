//client/src/app/(dashboard)/student-dashboard/components/GPA.tsx
export default function GPA() {
  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl p-6 text-white">
      <p className="text-sm opacity-90 mb-2">Current GPA</p>
      <p className="text-4xl font-bold mb-1">3.85</p>
      <p className="text-xs opacity-75">Out of 4.0</p>
      <div className="mt-4 pt-4 border-t border-slate-700">
        <div className="flex justify-between text-sm">
          <span className="opacity-75">Semester GPA</span>
          <span className="font-semibold">3.92</span>
        </div>
      </div>
    </div>
  );
}



