// //client\src\app\(dashboard)\teacher-dashboard\components\Navbar.tsx
// "use client"

// import { FiSearch, FiUser } from "react-icons/fi"
// import NotificationBell from "../../student-dashboard/components/NotificationBell"

// export default function Navbar() {
//   return (
//     <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
//       <div className="flex-1 max-w-2xl">
//         <div className="relative">
//           <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             placeholder="Search or type a command"
//             className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm shadow-sm
//             focus:outline-none focus:ring-4 focus:ring-slate-200 focus:border-gray-300 transition"
//           />
//         </div>
//       </div>

//       <div className="flex items-center gap-4 ml-6">
//         <NotificationBell />
//         <button className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-xl transition-colors">
//           <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
//             <FiUser className="text-white text-sm" />
//           </div>
//         </button>
//       </div>
//     </header>
//   )
// }



//client\src\app\(dashboard)\teacher-dashboard\components\Navbar.tsx
'use client';
import { FiSearch, FiUser } from 'react-icons/fi';
import NotificationBell from '../../../../../components/NotificationBell';

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 max-w-2xl">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input placeholder="Search courses, tasks..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm shadow-sm focus:outline-none focus:ring-4 focus:ring-slate-200 focus:border-gray-300 transition" />
        </div>
      </div>

      <div className="flex items-center gap-4 ml-6">
        <NotificationBell />
        <div className="w-8 h-8 bg-slate-900 rounded-full flex items-center justify-center">
          <FiUser className="text-white text-sm" />
        </div>
      </div>
    </header>
  );
}
