import DashboardLayout from '../components/DashboardLayout';

export default function CoursesPage() {
  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold text-slate-900 mb-6">My Courses</h1>
      <div className="bg-white rounded-xl border p-6">
        <p className="text-gray-500">Course information will appear here</p>
      </div>
    </DashboardLayout>
  );
}
