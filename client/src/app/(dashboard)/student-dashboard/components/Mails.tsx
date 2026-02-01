//client\src\app\(dashboard)\student-dashboard\components\Mails.tsx
import { FiMail } from 'react-icons/fi';

export default function Mails() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center gap-2 mb-4">
        <FiMail className="text-slate-900" />
        <h3 className="font-semibold text-slate-900">Recent Mails</h3>
      </div>
      <div className="flex items-center justify-center h-32 text-gray-400">
        <p className="text-sm">No new messages</p>
      </div>
    </div>
  );
}
