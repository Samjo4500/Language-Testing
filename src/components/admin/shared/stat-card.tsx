'use client';

import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: string;
  gradient: string;
  subtitle?: string;
}

export function StatCard({ icon: Icon, label, value, change, gradient, subtitle }: StatCardProps) {
  return (
    <div className="glass-card p-5 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-20 h-20 opacity-10 group-hover:opacity-20 transition-opacity">
        <Icon className="w-full h-full" />
      </div>
      <div className="flex items-center gap-3 mb-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white shadow-lg`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="text-white/50 text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-white">{value}</span>
        {change && (
          <span className={`text-xs font-medium flex items-center gap-0.5 mb-1 ${change.startsWith('+') ? 'text-green-400' : change.startsWith('-') ? 'text-red-400' : 'text-white/40'}`}>
            {change.startsWith('+') ? <ArrowUpRight className="h-3 w-3" /> : change.startsWith('-') ? <ArrowDownRight className="h-3 w-3" /> : null}
            {change}
          </span>
        )}
      </div>
      {subtitle && <p className="text-white/30 text-xs mt-1">{subtitle}</p>}
    </div>
  );
}
