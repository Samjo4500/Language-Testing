import { Navbar } from '@/components/navbar';

export default function CommunityLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0618]">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-5xl space-y-8">
          {/* Header skeleton */}
          <div className="text-center space-y-4">
            <div className="inline-block h-7 w-32 rounded-full bg-white/5 animate-pulse" />
            <div className="h-8 w-64 mx-auto rounded-lg bg-white/5 animate-pulse" />
            <div className="h-4 w-80 mx-auto rounded bg-white/5 animate-pulse" />
          </div>

          {/* Tab bar skeleton */}
          <div className="flex justify-center">
            <div className="flex gap-1 p-1 rounded-xl bg-white/5 animate-pulse">
              <div className="h-9 w-28 rounded-lg bg-white/5" />
              <div className="h-9 w-28 rounded-lg bg-white/5" />
              <div className="h-9 w-28 rounded-lg bg-white/5" />
            </div>
          </div>

          {/* Filter bar skeleton */}
          <div className="glass-card p-4 space-y-3 animate-pulse">
            <div className="flex items-center gap-2">
              <div className="h-3 w-12 rounded bg-white/5" />
            </div>
            <div className="flex flex-wrap gap-3">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-8 w-24 rounded-lg bg-white/5" />
              ))}
            </div>
          </div>

          {/* Partner cards grid skeleton */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-5 space-y-3 animate-pulse">
                {/* Avatar + name + languages */}
                <div className="flex items-start gap-3">
                  <div className="h-11 w-11 rounded-full bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 rounded bg-white/5" />
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-14 rounded bg-white/5" />
                      <div className="h-2.5 w-2.5 rounded bg-white/5" />
                      <div className="h-3 w-14 rounded bg-white/5" />
                    </div>
                  </div>
                </div>
                {/* Bio lines */}
                <div className="space-y-1.5">
                  <div className="h-3 w-full rounded bg-white/5" />
                  <div className="h-3 w-2/3 rounded bg-white/5" />
                </div>
                {/* Interest tags */}
                <div className="flex flex-wrap gap-1">
                  {[1, 2, 3].map((t) => (
                    <div key={t} className="h-5 w-16 rounded-full bg-white/5" />
                  ))}
                </div>
                {/* Bottom row */}
                <div className="flex items-center justify-between pt-2">
                  <div className="h-3 w-20 rounded bg-white/5" />
                  <div className="h-7 w-20 rounded-lg bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
