// //client/src/app/(dashboard)/student-dashboard/components/Navbar.tsx
// 'use client';

// import { FiSearch, FiBell, FiUser } from 'react-icons/fi';

// export default function Navbar() {
//   return (
//     <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 sticky top-0 z-10">
//       {/* Search Bar */}
//       <div className="flex-1 max-w-2xl">
//         <div className="relative">
//           <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder="Search or type a command"
//             className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition"
//           />
//         </div>
//       </div>

//       {/* Right Side */}
//       <div className="flex items-center gap-4 ml-6">
//         {/* Notification */}
//         <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
//           <FiBell className="text-xl" />
//           <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
//         </button>

//         {/* Profile */}
//         <button className="flex items-center gap-2 p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
//           <div className="w-8 h-8 bg-gradient-to-br from-slate-900 to-slate-700 rounded-full flex items-center justify-center">
//             <FiUser className="text-white text-sm" />
//           </div>
//         </button>
//       </div>
//     </header>
//   );
// }





// client/src/app/(dashboard)/student-dashboard/components/Navbar.tsx
'use client';

import { FiSearch, FiUser } from 'react-icons/fi';
import NotificationBell from './NotificationBell';

export default function Navbar() {
  return (
    <header
      className="
      h-16
      bg-white/80
      backdrop-blur-xl
      border-b border-gray-200/60
      flex items-center justify-between
      px-6
      sticky top-0
      z-20
      "
    >

      {/* Search */}
      <div className="flex-1 max-w-xl">

        <div className="relative group">

          <FiSearch
            className="
            absolute left-3 top-1/2 -translate-y-1/2
            text-slate-400
            text-[15px]
            group-focus-within:text-slate-600
            transition-colors
            "
          />

          <input
            type="text"
            placeholder="Search or type a command"
            className="
            w-full
            pl-10 pr-4
            h-10
            bg-[#F8FAFC]
            border border-gray-200/70
            rounded-xl

            text-[14.5px]
            text-slate-700
            placeholder:text-slate-400

            shadow-sm
            transition-all duration-200

            hover:border-gray-300
            hover:bg-white

            focus:outline-none
            focus:bg-white
            focus:border-gray-300
            focus:ring-4
            focus:ring-slate-200/60
            "
          />

        </div>

      </div>


      {/* Right section */}
      <div className="flex items-center gap-3 ml-6">

        {/* Notification */}
        <div
          className="
          flex items-center justify-center
          w-10 h-10
          rounded-xl
          hover:bg-slate-100
          transition-colors
          cursor-pointer
          "
        >
          <NotificationBell />
        </div>


        {/* Avatar */}
        <button
          className="
          flex items-center justify-center
          w-10 h-10
          rounded-xl
          bg-gradient-to-br from-slate-900 to-slate-700
          shadow-sm

          hover:shadow-md
          hover:scale-[1.03]

          transition-all duration-200
          "
        >

          <FiUser className="text-white text-[15px]" />

        </button>

      </div>

    </header>
  );
}
