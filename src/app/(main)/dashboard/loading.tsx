import { Navbar } from '@/components/navbar';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0618]">
      <Navbar />
      <main className="flex-1 px-4 py-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Welcome skeleton */}
          <div className="space-y-2">
            <div className="h-8 w-64 rounded-lg bg-white/5 animate-pulse" />
            <div className="h-4 w-80 rounded bg-white/5 animate-pulse" />
          </div>

          {/* Account status card skeleton */}
          <div className="glass-card p-6 space-y-4 animate-pulse">
            <div className="flex items-center gap-2">
              <div className="h-5 w-5 rounded bg-white/5" />
              <div className="h-5 w-32 rounded bg-white/5" />
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-24 rounded bg-white/5" />
                  <div className="h-6 w-16 rounded-full bg-white/5" />
                </div>
                <div className="h-3 w-64 rounded bg-white/5" />
              </div>
              <div className="h-10 w-36 rounded-xl bg-white/5" />
            </div>
          </div>

          {/* Quick actions grid skeleton */}
          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-5 space-y-3 animate-pulse">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl bg-white/5" />
                  <div className="space-y-2">
                    <div className="h-4 w-28 rounded bg-white/5" />
                    <div className="h-3 w-36 rounded bg-white/5" />
                  </div>
                </div>
                <div className="h-4 w-24 rounded bg-white/5" />
              </div>
            ))}
          </div>

          {/* My Courses card skeleton */}
          <div className="glass-card p-6 space-y-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-white/5" />
                <div className="h-5 w-24 rounded bg-white/5" />
              </div>
              <div className="h-3 w-24 rounded bg-white/5" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {[1, 2].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-lg bg-white/5" />
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-32 rounded bg-white/5" />
                      <div className="h-3 w-20 rounded bg-white/5" />
                    </div>
                  </div>
                  <div className="h-2 w-full rounded-full bg-white/5" />
                </div>
              ))}
            </div>
          </div>

          {/* Certificates card skeleton */}
          <div className="glass-card p-6 space-y-4 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-5 w-5 rounded bg-white/5" />
                <div className="h-5 w-32 rounded bg-white/5" />
              </div>
              <div className="h-5 w-20 rounded-full bg-white/5" />
            </div>
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white/5" />
                    <div className="space-y-2">
                      <div className="h-4 w-40 rounded bg-white/5" />
                      <div className="h-3 w-48 rounded bg-white/5" />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="h-8 w-16 rounded-lg bg-white/5" />
                    <div className="h-8 w-16 rounded-lg bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
