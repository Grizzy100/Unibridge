//client/src/app/(dashboard)/student-dashboard/my-info/page.tsx
import DashboardLayout from '../components/DashboardLayout';
import { FiUser, FiMail, FiPhone, FiMapPin } from 'react-icons/fi';

export default function MyInfoPage() {
  const studentInfo = {
    name: 'John Doe',
    studentId: 'STU2025001',
    email: 'john.doe@university.edu',
    phone: '+1 234 567 8900',
    department: 'Computer Science',
    semester: '6th Semester',
    year: '3rd Year',
    address: '123 University Street, Campus Area',
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">My Information</h1>
        
        {/* Profile Card */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <div className="flex items-center gap-6 mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-slate-900 to-slate-700 rounded-full flex items-center justify-center">
              <FiUser className="text-white text-3xl" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{studentInfo.name}</h2>
              <p className="text-gray-600">{studentInfo.studentId}</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-6">
            <InfoItem icon={FiMail} label="Email" value={studentInfo.email} />
            <InfoItem icon={FiPhone} label="Phone" value={studentInfo.phone} />
            <InfoItem icon={FiUser} label="Department" value={studentInfo.department} />
            <InfoItem icon={FiUser} label="Semester" value={studentInfo.semester} />
            <InfoItem icon={FiUser} label="Year" value={studentInfo.year} />
            <InfoItem icon={FiMapPin} label="Address" value={studentInfo.address} />
          </div>
        </div>

        {/* Edit Button */}
        <button className="px-6 py-2.5 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800 transition-colors">
          Edit Profile
        </button>
      </div>
    </DashboardLayout>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="text-slate-900 mt-1" />
      <div>
        <p className="text-sm text-gray-600 mb-1">{label}</p>
        <p className="font-medium text-slate-900">{value}</p>
      </div>
    </div>
  );
}
