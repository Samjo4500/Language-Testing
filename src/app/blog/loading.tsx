import { Navbar } from '@/components/navbar';

export default function BlogLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0a0618]">
      <Navbar />
      <main className="flex-1 px-4 py-8 sm:py-12">
        <div className="mx-auto max-w-6xl space-y-10">
          {/* Hero skeleton */}
          <div className="text-center space-y-4">
            <div className="inline-block h-7 w-24 rounded-full bg-white/5 animate-pulse" />
            <div className="h-9 w-80 mx-auto rounded-lg bg-white/5 animate-pulse" />
            <div className="h-4 w-[28rem] mx-auto rounded bg-white/5 animate-pulse" />
          </div>

          {/* Section title skeleton */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-white/5 animate-pulse" />
            <div className="h-6 w-40 rounded bg-white/5 animate-pulse" />
          </div>

          {/* Blog article cards grid skeleton */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="glass-card p-6 flex flex-col space-y-4 animate-pulse">
                {/* Category badge + read time */}
                <div className="flex items-center gap-2">
                  <div className="h-5 w-16 rounded bg-white/5" />
                  <div className="h-4 w-20 rounded bg-white/5" />
                </div>
                {/* Title */}
                <div className="space-y-2">
                  <div className="h-5 w-full rounded bg-white/5" />
                  <div className="h-5 w-3/4 rounded bg-white/5" />
                </div>
                {/* Excerpt */}
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-full rounded bg-white/5" />
                  <div className="h-3 w-full rounded bg-white/5" />
                  <div className="h-3 w-2/3 rounded bg-white/5" />
                </div>
                {/* Author + read more */}
                <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                  <div className="flex items-center gap-2">
                    <div className="h-7 w-7 rounded-full bg-white/5" />
                    <div className="h-3 w-20 rounded bg-white/5" />
                  </div>
                  <div className="h-3 w-16 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
