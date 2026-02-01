// // client/src/app/(dashboard)/student-dashboard/components/PersonalSpace.tsx
// import AttendenceChart from './AttendenceChart';
// import GPA from './GPA';
// import Tasks from './Tasks';       // NEW
// import Outpass from './Outpass';
// import Mails from './Mails';       // optional (if you want in right column later)
// import Holiday from './Holiday';   // optional (if you want in right column later)

// export default function PersonalSpace() {
//   return (
//     <div className="space-y-6">
//       {/* Top Row */}
//       <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
//         <div className="xl:col-span-2">
//           <AttendenceChart />
//         </div>
//         <GPA />
//       </div>

//       {/* Bottom Row (wireframe = 2 cards) */}
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//         <Tasks />
//         <Outpass />
//       </div>

//       {/* Optional: if you still want Holiday + Mails, add a 3rd row */}
//       {/* 
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
//         <Holiday />
//         <Mails />
//       </div> 
//       */}
//     </div>
//   );
// }



// client/src/app/(dashboard)/student-dashboard/components/PersonalSpace.tsx
import AttendenceChart from './AttendenceChart';
import GPA from './GPA';
import TaskQueue from './TaskQueue';  // ✅ Changed from Tasks to TaskQueue
import Outpass from './Outpass';

export default function PersonalSpace() {
  return (
    <div className="space-y-6">
      {/* Top Row - Attendance Chart & GPA */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <AttendenceChart />
        </div>
        <GPA />
      </div>

      {/* Bottom Row - Task Queue & Outpass Queue */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <TaskQueue />
        <Outpass />
      </div>
    </div>
  );
}
