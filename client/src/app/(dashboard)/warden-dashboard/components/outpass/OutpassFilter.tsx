//client\src\app\(dashboard)\warden-dashboard\components\outpass\OutpassFilter.tsx
export default function OutpassFilter({ value, onChange }: any) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border rounded-lg px-3 py-1.5 text-sm ml-auto"
    >
      <option value="ALL">All</option>
      <option value="DAY_PASS">Day Outpass</option>
      <option value="LEAVE_PASS">Leave Outpass</option>
    </select>
  )
}
