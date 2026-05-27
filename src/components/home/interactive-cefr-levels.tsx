'use client';

import { useState } from 'react';
import { useHydrated } from '@/hooks/use-hydrated';
import { Globe, CheckCircle2 } from 'lucide-react';
import { AnimatedSection } from '@/components/home/animated-section';
import { CEFR_LEVELS } from '@/components/home/constants';

/* ======================================================
   INTERACTIVE CEFR LEVELS — Inner content (section wrapper in page.tsx)
   ====================================================== */
export default function InteractiveCEFRLevels() {
  const [activeTab, setActiveTab] = useState(0);
  const mounted = useHydrated();

  const active = CEFR_LEVELS[activeTab];

  return (
    <div className="container relative mx-auto px-4">
      <AnimatedSection>
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
            <Globe className="h-3.5 w-3.5 text-blue-400" />
            <span className="text-xs text-blue-300 font-medium uppercase tracking-wider">CEFR Framework</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white">
            Interactive CEFR Levels
          </h2>
          <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
            Click on each level to see detailed progression from beginner to mastery.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection delay={200}>
        <div className="max-w-4xl mx-auto">
          <div className="gradient-border-wrap rounded-[21px] p-[1px]">
            <div className="glass-card-neon p-6 md:p-10 h-full">
              {/* Level Tabs */}
              <div className="flex flex-wrap gap-2 mb-8 justify-center">
                {CEFR_LEVELS.map((lvl, i) => (
                  <button
                    key={lvl.level}
                    onClick={() => setActiveTab(i)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all duration-300 cursor-pointer ${
                      activeTab === i
                        ? 'text-white shadow-lg scale-105'
                        : 'glass text-white/50 hover:text-white/80'
                    }`}
                    style={activeTab === i ? { background: `linear-gradient(135deg, ${lvl.color}40, ${lvl.color}20)`, boxShadow: `0 4px 20px ${lvl.color}30` } : {}}
                  >
                    {lvl.level}
                  </button>
                ))}
              </div>

              {/* Active Level Content */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className="flex h-14 w-14 items-center justify-center rounded-xl text-white font-bold text-xl shadow-lg"
                      style={{ background: `linear-gradient(135deg, ${active.color}60, ${active.color}30)` }}
                    >
                      {active.level}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-xl font-bold text-white">{active.level} — {active.title}</h3>
                      <p className="text-xs text-white/40">{active.percentage}% Complete</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="h-3 rounded-full bg-white/5 overflow-hidden mb-6">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: mounted ? `${active.percentage}%` : '0%',
                        background: `linear-gradient(90deg, ${active.color}80, ${active.color})`,
                      }}
                    />
                  </div>

                  <p className="text-sm text-white/60 leading-relaxed">{active.desc}</p>
                </div>

                <div>
                  <p className="text-xs text-white/40 uppercase tracking-wider mb-3">Key Capabilities</p>
                  <div className="space-y-2">
                    {active.items.map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 shrink-0" style={{ color: active.color }} />
                        <span className="text-sm text-white/70">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </div>
  );
}
