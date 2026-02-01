export default function AttendenceChart() {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const data = [90, 95, 75, 88, 92, 97, 94];

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-slate-900 mb-6">Weekly Performance</h3>
      <div className="h-64">
        <div className="flex items-end justify-around h-full gap-3">
          {days.map((day, index) => (
            <div key={day} className="flex-1 flex flex-col items-center gap-2">
              <div 
                className="w-full bg-slate-900 rounded-t-lg transition-all hover:bg-slate-800 cursor-pointer" 
                style={{ height: `${data[index]}%` }}
              ></div>
              <span className="text-xs font-medium text-gray-600">{day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



