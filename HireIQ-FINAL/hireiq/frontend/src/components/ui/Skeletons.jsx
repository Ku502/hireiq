/**
 * Skeleton components — shimmer placeholders shown while data loads.
 * Fix: replaces raw spinners with content-shaped skeletons (much better UX).
 */

function Shimmer({ className = '' }) {
  return (
    <div className={`relative overflow-hidden bg-bg-elevated rounded-lg ${className}`}>
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite]
        bg-gradient-to-r from-transparent via-white/[0.04] to-transparent" />
    </div>
  )
}

// Add shimmer keyframe to index.css via style tag
const shimmerStyle = document.createElement('style')
shimmerStyle.textContent = `
  @keyframes shimmer { to { transform: translateX(100%); } }
`
document.head.appendChild(shimmerStyle)

export function DashboardSkeleton() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <div className="space-y-2">
        <Shimmer className="h-8 w-56" />
        <Shimmer className="h-4 w-72" />
      </div>
      {/* Stats row */}
      <div className="grid grid-cols-4 gap-4">
        {[1,2,3,4].map(i => (
          <div key={i} className="glass p-5">
            <Shimmer className="h-9 w-16 mx-auto mb-2" />
            <Shimmer className="h-3 w-20 mx-auto" />
          </div>
        ))}
      </div>
      {/* Chart */}
      <div className="glass p-6">
        <Shimmer className="h-3 w-28 mb-5" />
        <Shimmer className="h-48 w-full" />
      </div>
      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="glass p-6 space-y-4">
          <Shimmer className="h-3 w-28" />
          {[1,2,3,4,5].map(i => (
            <div key={i} className="space-y-1.5">
              <div className="flex justify-between">
                <Shimmer className="h-3 w-24" />
                <Shimmer className="h-3 w-16" />
              </div>
              <Shimmer className="h-1.5 w-full" />
            </div>
          ))}
        </div>
        <div className="glass overflow-hidden">
          <Shimmer className="h-10 w-full rounded-none" />
          {[1,2,3,4].map(i => (
            <div key={i} className="flex items-center gap-4 px-6 py-4 border-b border-border-subtle last:border-0">
              <Shimmer className="w-10 h-10 rounded-full flex-shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Shimmer className="h-3.5 w-40" />
                <Shimmer className="h-3 w-24" />
              </div>
              <Shimmer className="h-5 w-16 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ReportSkeleton() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
      <div className="glass p-8 flex items-center gap-8">
        <Shimmer className="w-24 h-24 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Shimmer className="h-3 w-32" />
          <Shimmer className="h-7 w-64" />
          <Shimmer className="h-3 w-40" />
          <Shimmer className="h-7 w-28 rounded-full" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {[1,2,3,4].map(i => <div key={i} className="glass p-4"><Shimmer className="h-9 w-8 mx-auto mb-2" /><Shimmer className="h-2.5 w-12 mx-auto" /></div>)}
      </div>
      <div className="glass p-6 space-y-3">
        <Shimmer className="h-3 w-28" />
        <Shimmer className="h-4 w-full" />
        <Shimmer className="h-4 w-5/6" />
        <Shimmer className="h-4 w-4/6" />
      </div>
    </div>
  )
}

export function SetupSkeleton() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12 space-y-5">
      <Shimmer className="h-7 w-56" />
      {[1,2,3].map(i => (
        <div key={i} className="glass p-6 space-y-3">
          <Shimmer className="h-3 w-24" />
          <div className="flex gap-2 flex-wrap">
            {[1,2,3,4].map(j => <Shimmer key={j} className="h-9 w-24 rounded-lg" />)}
          </div>
        </div>
      ))}
    </div>
  )
}
