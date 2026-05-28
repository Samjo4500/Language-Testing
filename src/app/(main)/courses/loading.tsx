import { Navbar } from '@/components/navbar';

export default function CoursesLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0618]">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl space-y-8">
          {/* Hero skeleton */}
          <div className="text-center space-y-4">
            <div className="inline-block h-7 w-36 rounded-full bg-white/5 animate-pulse" />
            <div className="h-9 w-72 mx-auto rounded-lg bg-white/5 animate-pulse" />
            <div className="h-4 w-96 mx-auto rounded bg-white/5 animate-pulse" />
            <div className="h-3 w-64 mx-auto rounded bg-white/5 animate-pulse" />
          </div>

          {/* Course cards grid skeleton */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="glass-card p-7 space-y-4 animate-pulse">
                {/* Icon + Title */}
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-white/5" />
                  <div className="space-y-2 flex-1">
                    <div className="h-5 w-24 rounded bg-white/5" />
                    <div className="h-3 w-32 rounded bg-white/5" />
                  </div>
                </div>
                {/* Level badge */}
                <div className="h-6 w-20 rounded-full bg-white/5" />
                {/* Price */}
                <div className="space-y-2">
                  <div className="h-8 w-16 rounded bg-white/5" />
                  <div className="h-3 w-28 rounded bg-white/5" />
                </div>
                {/* Stats row */}
                <div className="flex gap-4">
                  <div className="h-3 w-16 rounded bg-white/5" />
                  <div className="h-3 w-16 rounded bg-white/5" />
                  <div className="h-3 w-12 rounded bg-white/5" />
                </div>
                {/* Divider */}
                <div className="h-px w-full bg-white/5" />
                {/* Features */}
                <div className="space-y-2">
                  {[1, 2, 3, 4].map((f) => (
                    <div key={f} className="flex items-center gap-2">
                      <div className="h-4 w-4 rounded-full bg-white/5" />
                      <div className="h-3 flex-1 rounded bg-white/5" />
                    </div>
                  ))}
                </div>
                {/* CTA */}
                <div className="h-10 w-full rounded-xl bg-white/5" />
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
