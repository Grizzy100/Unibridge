"use client";

interface AttendanceStatsProps {
  stats: {
    overallPercentage: number;
    totalCourses: number;
    totalClassesAcrossAllCourses: number;
    totalAttendedAcrossAllCourses: number;
  };
}

export default function AttendanceStats({ stats }: AttendanceStatsProps) {
  const getColorClass = (percentage: number) => {
    if (percentage >= 75) return "bg-green-50 border-green-200 text-green-800";
    if (percentage >= 60) return "bg-yellow-50 border-yellow-200 text-yellow-800";
    return "bg-red-50 border-red-200 text-red-800";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Overall Percentage */}
      <div className={`border rounded-lg p-4 ${getColorClass(stats.overallPercentage)}`}>
        <p className="text-sm font-medium opacity-80">Overall Attendance</p>
        <p className="text-3xl font-bold mt-2">{stats.overallPercentage}%</p>
      </div>

      {/* Total Courses */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm font-medium text-blue-800 opacity-80">Enrolled Courses</p>
        <p className="text-3xl font-bold text-blue-900 mt-2">{stats.totalCourses}</p>
      </div>

      {/* Total Classes */}
      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p className="text-sm font-medium text-purple-800 opacity-80">Total Classes</p>
        <p className="text-3xl font-bold text-purple-900 mt-2">
          {stats.totalClassesAcrossAllCourses}
        </p>
      </div>

      {/* Classes Attended */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
        <p className="text-sm font-medium text-indigo-800 opacity-80">Classes Attended</p>
        <p className="text-3xl font-bold text-indigo-900 mt-2">
          {stats.totalAttendedAcrossAllCourses}
        </p>
      </div>
    </div>
  );
}
