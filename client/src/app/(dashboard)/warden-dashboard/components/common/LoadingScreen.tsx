//client\src\app\(dashboard)\warden-dashboard\components\common\LoadingScreen.tsx
export default function LoadingScreen({ label }: { label?: string }) {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="animate-spin h-10 w-10 border-b-2 border-slate-900 rounded-full mx-auto" />
        <p className="mt-4 text-sm text-gray-600">{label || "Loading..."}</p>
      </div>
    </div>
  )
}
