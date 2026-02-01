//client\src\app\(dashboard)\warden-dashboard\components\Navbar.tsx
// import { FiSearch, FiBell, FiUser } from "react-icons/fi"

// export default function Navbar() {
//   return (
//     <header className="h-16 bg-white border-b flex items-center px-6 gap-6">
//       {/* Search */}
//       <div className="flex-1 max-w-md">
//         <div className="flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2 focus-within:ring-1 focus-within:ring-slate-900">
//           <FiSearch className="text-slate-400 text-sm" />
//           <input
//             type="text"
//             placeholder="Search students, outpasses…"
//             className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
//           />
//         </div>
//       </div>

//       {/* Right actions */}
//       <div className="ml-auto flex items-center gap-4">
//         {/* Notifications */}
//         <button className="relative text-slate-600 hover:text-slate-900">
//           <FiBell className="text-lg" />
//           {/* unread dot */}
//           <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-500" />
//         </button>

//         {/* User */}
//         <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center">
//           <FiUser className="text-white text-sm" />
//         </div>
//       </div>
//     </header>
//   )
// }



'use client';  // ← ADD 'use client'
import { FiSearch, FiUser } from 'react-icons/fi';           // ← Remove FiBell
import NotificationBell from '../../../../../components/NotificationBell';

export default function Navbar() {
  return (
    <header className="h-16 bg-white border-b flex items-center px-6 gap-6">
      {/* Search - UNCHANGED */}
      <div className="flex-1 max-w-md">
        <div className="flex items-center gap-2 rounded-lg border bg-slate-50 px-3 py-2 focus-within:ring-1 focus-within:ring-slate-900">
          <FiSearch className="text-slate-400 text-sm" />
          <input
            type="text"
            placeholder="Search students, outpasses…"
            className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Right actions - REPLACED FiBell */}
      <div className="ml-auto flex items-center gap-4">
        <NotificationBell />         {/* ✅ Replaces static FiBell */}
        <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center">
          <FiUser className="text-white text-sm" />
        </div>
      </div>
    </header>
  );
}
