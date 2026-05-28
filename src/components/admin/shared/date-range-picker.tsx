'use client';

import { useState } from 'react';
import { Calendar } from 'lucide-react';

interface DateRangePickerProps {
  value: string;
  onChange: (range: string) => void;
  options?: Array<{ value: string; label: string }>;
}

export function DateRangePicker({ value, onChange, options }: DateRangePickerProps) {
  const defaultOptions = [
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' },
    { value: '1y', label: '1 Year' },
    { value: 'all', label: 'All Time' },
  ];

  const opts = options || defaultOptions;

  return (
    <div className="flex items-center gap-2">
      <Calendar className="h-4 w-4 text-white/40" />
      <div className="flex rounded-lg border border-white/10 overflow-hidden">
        {opts.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              value === opt.value
                ? 'bg-violet-500/20 text-violet-400 border-r border-white/10 last:border-r-0'
                : 'text-white/50 hover:text-white hover:bg-white/5 border-r border-white/10 last:border-r-0'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
