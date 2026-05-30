'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Play, Pause, RotateCcw, Headphones, Sparkles } from 'lucide-react';

interface AudioLessonPlayerProps {
  lessonTitle: string;
  lessonContent: string;
  lessonObjective?: string;
  moduleName?: string;
}

export default function AudioLessonPlayer({
  lessonTitle,
  lessonContent,
  lessonObjective,
  moduleName,
}: AudioLessonPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(0.9);
  const [hasStarted, setHasStarted] = useState(false);

  const getText = useCallback(() => {
    const intro = lessonObjective
      ? `Welcome to ${lessonTitle}${moduleName ? `, part of ${moduleName}` : ''}. ${lessonObjective}. Let's begin. `
      : `Welcome to ${lessonTitle}. Let's begin. `;
    return intro + lessonContent;
  }, [lessonTitle, lessonContent, lessonObjective, moduleName]);

  const play = useCallback(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const text = getText();
    const utter = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    utter.voice =
      voices.find((v) => v.lang === 'en-GB' && v.name.includes('Female')) ||
      voices.find((v) => v.name.includes('Zira') || v.name.includes('Samantha')) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0];
    utter.rate = speed;
    utter.pitch = 1.05;
    utter.volume = 0.8;
    const totalLen = text.length;
    utter.onboundary = (e) => {
      if (e.name === 'word') setProgress(Math.min((e.charIndex / totalLen) * 100, 100));
    };
    utter.onend = () => {
      setIsPlaying(false);
      setProgress(100);
    };
    window.speechSynthesis.speak(utter);
    setIsPlaying(true);
    setHasStarted(true);
  }, [getText, speed]);

  const pause = useCallback(() => {
    window.speechSynthesis?.pause();
    setIsPlaying(false);
  }, []);

  const resume = useCallback(() => {
    window.speechSynthesis?.resume();
    setIsPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause();
    } else if (hasStarted && window.speechSynthesis?.paused) {
      resume();
    } else {
      play();
    }
  }, [isPlaying, hasStarted, play, pause, resume]);

  const rewind = useCallback(() => {
    window.speechSynthesis.cancel();
    setProgress(Math.max(0, progress - 15));
    setTimeout(() => play(), 100);
  }, [progress, play]);

  const changeSpeed = useCallback(() => {
    const speeds = [0.75, 0.9, 1.0];
    setSpeed(speeds[(speeds.indexOf(speed) + 1) % speeds.length]);
  }, [speed]);

  useEffect(() => {
    return () => window.speechSynthesis?.cancel();
  }, []);

  const words = getText().split(/\s+/).length;
  const mins = Math.ceil((words / 130) / speed);

  return (
    <div className="w-full bg-gradient-to-b from-[#14143a]/80 to-[#0c0c24]/80 border border-white/10 rounded-2xl overflow-hidden">
      <div className="h-0.5 bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500" />
      <div className="p-5">
        <div className="flex items-center gap-3 mb-4">
          <div
            className={`w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500/30 ${
              isPlaying ? 'animate-pulse' : ''
            }`}
          >
            <img src="/lexi-avatar.png" alt="Lexi" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <Headphones size={14} className="text-cyan-400" />
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-wider">
                AI-Narrated Lesson
              </span>
            </div>
            <h3 className="text-sm font-medium text-white truncate">
              {isPlaying
                ? 'Lexi is speaking...'
                : hasStarted
                  ? 'Paused'
                  : `Listen to "${lessonTitle}"`}
            </h3>
            <p className="text-[11px] text-white/30">
              ~{mins} min · {words} words · {speed}x speed
            </p>
          </div>
          <Sparkles size={16} className="text-cyan-400/30 shrink-0" />
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={rewind}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/40 hover:text-white/70 hover:bg-white/10 transition-all"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={toggle}
            className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-lg ${
              isPlaying
                ? 'bg-white/10 border border-white/20 text-white'
                : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/20'
            }`}
          >
            {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-1" />}
          </button>
          <button
            onClick={changeSpeed}
            className="px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-medium text-white/40 hover:text-white/70 hover:bg-white/10 transition-all"
          >
            {speed}x
          </button>
        </div>

        {!hasStarted && (
          <p className="mt-3 text-center text-xs text-white/30">
            Lexi will narrate this lesson for you. Perfect for learning on the go.
          </p>
        )}
      </div>
    </div>
  );
}
