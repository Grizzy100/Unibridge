//client\src\app\(dashboard)\warden-dashboard\components\outpass\OutpassFilter.tsx
export default function OutpassFilter({ value, onChange }: any) {
  return (
    <div className="w-full sm:w-auto">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full sm:w-[180px]
          border border-slate-200 bg-white
          rounded-xl px-3 py-2
          text-[13px] sm:text-sm text-slate-700
          focus:outline-none focus:ring-2 focus:ring-slate-900/10
        "
      >
        <option value="ALL">All</option>
        <option value="DAY_PASS">Day Outpass</option>
        <option value="LEAVE_PASS">Leave Outpass</option>
      </select>
    </div>
  )
}
