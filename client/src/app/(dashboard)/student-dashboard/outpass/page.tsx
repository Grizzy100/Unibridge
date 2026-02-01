// // //client/src/app/(dashboard)/student-dashboard/outpass/page.tsx
// // client/src/app/(dashboard)/student-dashboard/outpass/page.tsx
// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import DashboardLayout from '../components/DashboardLayout';
// import OutpassQueue from './components/OutpassQueue';
// import OutpassCard from './components/OutpassCard';
// import OutpassModal from './components/OutpassModal';
// import { FiPlus } from 'react-icons/fi';
// import { getStudentOutpasses, cancelOutpass, OutpassRequest } from '../../../../../lib/outpass';
// import { getUser, getToken } from '../../../../../lib/auth';

// export default function OutpassPage() {
//   const router = useRouter();
//   const [outpasses, setOutpasses] = useState<OutpassRequest[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [showModal, setShowModal] = useState(false);
//   const [error, setError] = useState('');

//   const user = getUser();
//   const token = getToken();

//   useEffect(() => {
//     if (!user || !token || user.role !== "STUDENT") {
//       router.replace('/login/student');
//     }
//   }, [user, token, router]);

//   useEffect(() => {
//     if (token) fetchOutpasses();
//   }, [token]);

//   const fetchOutpasses = async () => {
//     if (!token) return;
//     setLoading(true);
//     setError('');
//     try {
//       const data = await getStudentOutpasses(token);
//       setOutpasses(data);
//     } catch (err: any) {
//       setError(err.message || 'Failed to fetch outpasses');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCancel = async (id: string) => {
//     if (!token || !confirm('Are you sure you want to cancel this outpass?')) return;
//     try {
//       await cancelOutpass(id, token);
//       await fetchOutpasses();
//     } catch (err: any) {
//       alert(err.message || 'Failed to cancel outpass');
//     }
//   };

//   const stats = {
//     total: outpasses.length,
//     approved: outpasses.filter((o) => o.status === 'APPROVED').length,
//     pending: outpasses.filter((o) => ['PENDING', 'PARENT_APPROVED'].includes(o.status)).length,
//   };

//   if (loading) {
//     return (
//       <DashboardLayout>
//         <div className="flex items-center justify-center h-64">
//           <div className="text-center">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
//             <p className="text-slate-600">Loading outpasses...</p>
//           </div>
//         </div>
//       </DashboardLayout>
//     );
//   }

//   return (
//     <DashboardLayout>
//       <div className="max-w-4xl mx-auto px-2 sm:px-4">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-5">
//           <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Outpass Requests</h1>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg text-sm">
//             {error}
//           </div>
//         )}

//         {/* Stats - Only show if there are requests */}
//         {outpasses.length > 0 && <OutpassQueue {...stats} />}

//         {/* Outpass List or Empty State */}
//         {outpasses.length === 0 ? (
//           <div className="bg-white rounded-lg border-2 border-dashed border-gray-200 p-8 sm:p-10 text-center transition">
//             <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
//               <FiPlus className="text-2xl text-slate-400" />
//             </div>
//             <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-1">No outpass requests yet</h3>
//             <p className="text-slate-600 mb-5 text-xs sm:text-sm">
//               Create your first outpass request to get started. Your requests will appear here once submitted.
//             </p>
//                         <button
//               onClick={() => setShowModal(true)}
//               className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md font-medium bg-slate-900 text-white hover:bg-slate-800 transition text-sm"
//             >
//               <span className="flex items-center justify-center">
//                 <FiPlus className="text-[14px] mr-0.5" />
//               </span>
//               <span>Create Request</span>
//             </button>

//           </div>
//         ) : (
//           <div className="space-y-3 mt-2">
//             {outpasses.map((outpass) => (
//               <OutpassCard
//                 key={outpass.id}
//                 outpass={outpass}
//                 onCancel={handleCancel}
//               />
//             ))}
//           </div>
//         )}

//         {/* Create Modal */}
//         {showModal && (
//           <OutpassModal
//             onClose={() => setShowModal(false)}
//             onSuccess={() => {
//               setShowModal(false);
//               fetchOutpasses();
//             }}
//           />
//         )}
//       </div>
//     </DashboardLayout>
//   );
// }






// client/src/app/(dashboard)/student-dashboard/outpass/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '../components/DashboardLayout';
import OutpassQueue from './components/OutpassQueue';
import OutpassCard from './components/OutpassCard';
import OutpassModal from './components/OutpassModal';
import { FiPlus } from 'react-icons/fi';
import { outpassAPI } from '../../../../../lib/outpass';
import { getUser, getToken } from '../../../../../lib/auth';

function OutpassPage() {
  const router = useRouter();
  const [outpasses, setOutpasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const user = getUser();
  const token = getToken();

  useEffect(() => {
    if (!user || !token || user.role !== "STUDENT") {
      router.replace('/login/student');
    }
  }, [user, token, router]);

  useEffect(() => {
    if (token) fetchOutpasses();
  }, [token]);

  const fetchOutpasses = async () => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const response = await outpassAPI.getMyOutpasses();
      setOutpasses(response.data || response);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch outpasses');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!token || !confirm('Are you sure you want to cancel this outpass?')) return;
    try {
      await outpassAPI.cancel(id);
      await fetchOutpasses();
    } catch (err: any) {
      alert(err.message || 'Failed to cancel outpass');
    }
  };

  const stats = {
    total: outpasses.length,
    approved: outpasses.filter((o) => o.status === 'APPROVED').length,
    pending: outpasses.filter((o) => ['PENDING', 'PARENT_APPROVED'].includes(o.status)).length,
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto mb-4"></div>
            <p className="text-slate-600">Loading outpasses...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header with Create Button */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Outpass Requests</h1>
            <p className="text-sm text-slate-600 mt-1">Manage your outpass applications</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium bg-slate-900 text-white hover:bg-slate-800 transition-all shadow-sm hover:shadow-md"
          >
            <FiPlus className="text-lg" />
            <span>Create Outpass</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-start gap-3">
            <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        {outpasses.length > 0 && <OutpassQueue {...stats} />}

        {/* Outpass List or Empty State */}
        {outpasses.length === 0 ? (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiPlus className="text-3xl text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No outpass requests yet</h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Create your first outpass request to get started. Your requests will appear here once submitted.
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium bg-slate-900 text-white hover:bg-slate-800 transition"
            >
              <FiPlus className="text-lg" />
              Create Your First Outpass
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {outpasses.map((outpass) => (
              <OutpassCard
                key={outpass.id}
                outpass={outpass}
                onCancel={handleCancel}
              />
            ))}
          </div>
        )}

        {/* Create Modal */}
        {showModal && (
          <OutpassModal
            onClose={() => setShowModal(false)}
            onSuccess={() => {
              setShowModal(false);
              fetchOutpasses();
            }}
          />
        )}
      </div>
    </DashboardLayout>
  );
}

export default OutpassPage;

