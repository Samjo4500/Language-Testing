'use client';

export function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color?: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass p-3 rounded-xl border border-white/10 text-sm">
      <p className="text-white/60 text-xs mb-1">{label}</p>
      {payload.map((entry, i) => (
        <p key={i} className="text-white font-medium" style={{ color: entry.color }}>
          {entry.name}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
        </p>
      ))}
    </div>
  );
}
