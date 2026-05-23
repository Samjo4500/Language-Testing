'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useHydrated } from '@/hooks/use-hydrated';
import { trackSpeakingDemoStart, trackSpeakingDemoComplete } from '@/lib/analytics';
import { Mic, CircleDot } from 'lucide-react';
import { AnimatedSection } from '@/components/home/animated-section';
import { WAVEFORM_HEIGHTS, WAVEFORM_DELAYS, CEFR_DIMENSIONS } from '@/components/home/constants';

/* ======================================================
   LIVE VOICE DEMO — Inner content (section wrapper in page.tsx)
   ====================================================== */
export default function LiveVoiceDemo() {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [inputLevel, setInputLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const mounted = useHydrated();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = useCallback(async () => {
    // Request mic permission and track result
    let micPermission: 'granted' | 'denied' | 'not_requested' = 'not_requested';
    try {
      const result = await navigator.permissions.query({ name: 'microphone' as PermissionName });
      micPermission = result.state === 'granted' ? 'granted' : result.state === 'denied' ? 'denied' : 'not_requested';
    } catch {
      // permissions.query may not be supported for microphone in all browsers
      micPermission = 'not_requested';
    }
    trackSpeakingDemoStart({ mic_permission: micPermission });
    setIsRecording(true);
    setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  }, []);

  const stopRecording = useCallback(() => {
    setIsRecording(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    trackSpeakingDemoComplete();
  }, []);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const dimensions = CEFR_DIMENSIONS.map((dim, idx) => ({
    ...dim,
    score: isRecording ? [82, 78, 87, 91, 75, 80][idx] : 0,
  }));

  return (
    <>
      {/* Ambient glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-purple-600/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[300px] bg-pink-600/10 rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[250px] bg-violet-500/8 rounded-full blur-[80px] animate-float-reverse" />
        <div className="orb orb-purple w-[500px] h-[500px] top-1/4 -left-24 animate-float-slow opacity-30" />
        <div className="orb orb-pink w-[400px] h-[400px] bottom-1/4 -right-16 animate-float-reverse opacity-25" />
        <div className="orb orb-purple w-[250px] h-[250px] top-2/3 left-1/3 animate-float-slow opacity-15" />
      </div>

      <div className="container relative mx-auto px-4">
        <AnimatedSection>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 mb-4">
              <Mic className="h-3.5 w-3.5 text-purple-400" />
              <span className="text-xs text-purple-300 font-medium uppercase tracking-wider">Live Voice Demo</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-white leading-tight">
              Interactive Speaking <span className="gradient-text-static">Assessment</span>
            </h2>
            <p className="mt-4 text-white/50 max-w-2xl mx-auto text-base">
              Experience our AI-powered speaking assessment with real-time feedback and analysis
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={200}>
          <div className="max-w-4xl mx-auto">
            {/* Gradient border wrapper — gradient bg = border, inner card covers the center */}
            <div className="speaking-gradient-border-wrap rounded-[22px] p-[2px]">
              <div className="glass-card-neon speaking-card-border p-6 md:p-10 h-full">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Left: Mic & Controls */}
                  <div className="flex flex-col items-center rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6">
                    {/* Status indicator */}
                    <div className="flex items-center gap-2 mb-6">
                      {isRecording ? (
                        <>
                          <span className="w-2.5 h-2.5 rounded-full bg-red-400 animate-pulse" />
                          <span className="text-sm text-red-300 font-medium">RECORDING</span>
                          <span className="text-sm text-white/70 ml-2">{formatTime(recordingTime)}</span>
                        </>
                      ) : (
                        <>
                          <CircleDot className="h-3 w-3 text-green-400" />
                          <span className="text-sm text-green-300 font-medium">READY</span>
                          <span className="text-sm text-white/70 ml-2">00:00</span>
                        </>
                      )}
                    </div>

                    {/* Waveform */}
                    <div className="flex items-center justify-center gap-[3px] h-16 mb-6">
                      {Array.from({ length: 30 }).map((_, i) => (
                        <div
                          key={i}
                          className={`waveform-bar ${isRecording ? (i % 2 === 0 ? 'active' : 'waveform-bar-alt active') : ''}`}
                          style={{
                            height: isRecording ? undefined : WAVEFORM_HEIGHTS[i],
                            animationDelay: WAVEFORM_DELAYS[i],
                            opacity: isRecording ? 1 : 0.25,
                          }}
                        />
                      ))}
                    </div>

                    {/* Mic button */}
                    <div className="relative mb-6">
                      {isRecording && (
                        <>
                          <div className="absolute inset-[-8px] rounded-full border-2 border-red-400/30 animate-ripple" />
                          <div className="absolute inset-[-8px] rounded-full border-2 border-red-400/20 animate-ripple" style={{ animationDelay: '0.5s' }} />
                        </>
                      )}
                      <div className={`absolute -inset-6 rounded-full transition-all duration-500 ${isRecording ? 'bg-red-500/15 blur-2xl' : 'bg-red-500/15 blur-2xl'}`} />
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                        className={`relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                          isRecording
                            ? 'bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-500/40 animate-recording-pulse'
                            : 'bg-gradient-to-br from-red-500 to-red-600 shadow-2xl shadow-red-500/40 hover:shadow-red-500/60 hover:scale-110 animate-mic-glow'
                        }`}
                      >
                        <Mic className={`h-8 w-8 text-white ${isRecording ? 'animate-pulse' : ''}`} />
                      </button>
                    </div>

                    {/* Speaking prompt */}
                    <div className="w-full mb-4">
                      <p className="text-xs text-white uppercase tracking-wider mb-2 font-medium">Speaking Prompt</p>
                      <div className="glass-card p-4">
                        <p className="text-sm text-white/70 italic leading-relaxed">
                          &ldquo;Describe a memorable experience from your life and why it shaped who you are.&rdquo;
                        </p>
                      </div>
                    </div>

                    {/* Input Level */}
                    <div className="w-full">
                      <p className="text-xs text-white uppercase tracking-wider mb-2 font-medium">Input Level</p>
                      <div className="flex gap-2">
                        {(['low', 'medium', 'high'] as const).map((level) => (
                          <button
                            key={level}
                            onClick={() => setInputLevel(level)}
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 cursor-pointer ${
                              inputLevel === level
                                ? 'bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg shadow-red-500/25'
                                : 'glass text-white/50 hover:text-white/80'
                            }`}
                          >
                            {level.charAt(0).toUpperCase() + level.slice(1)}
                          </button>
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-white/60 mt-4 text-center">
                      Click to start — mic permission required
                    </p>
                  </div>

                  {/* Right: 6 Dimensions */}
                  <div>
                    <p className="text-xs text-white uppercase tracking-wider mb-4 font-medium">6 Dimensions</p>
                    <div className="space-y-4">
                      {dimensions.map((dim) => (
                        <div key={dim.label} className="glass-card p-3">
                          <div className="flex items-center gap-3 mb-2">
                            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${dim.color} text-white font-bold text-sm shadow-lg`}>
                              {dim.letter}
                            </div>
                            <span className="text-sm font-medium text-white">{dim.label}</span>
                            {isRecording && (
                              <span className={`ml-auto text-sm font-bold bg-gradient-to-r ${dim.color} bg-clip-text text-transparent`}>
                                {dim.score}%
                              </span>
                            )}
                          </div>
                          <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <div
                              className={`h-full rounded-full bg-gradient-to-r ${dim.color} transition-all duration-1000`}
                              style={{ width: isRecording ? `${dim.score}%` : '0%' }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 text-center">
                  <p className="text-xs text-white/30">
                    This is an interactive demo. Full speaking assessment with AI scoring available on Premium plans.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </>
  );
}
