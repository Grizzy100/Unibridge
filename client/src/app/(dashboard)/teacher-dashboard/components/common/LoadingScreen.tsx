//client\src\app\(dashboard)\teacher-dashboard\components\common\LoadingScreen.tsx
export default function LoadingScreen({ label }: { label?: string }) {
  return (
    <div className="min-h-[420px] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-slate-900 mx-auto" />
        <p className="mt-4 text-sm text-slate-600">{label || "Loading..."}</p>
      </div>
    </div>
  )
}
