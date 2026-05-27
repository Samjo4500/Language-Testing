import { Loader2 } from 'lucide-react';

export default function CertificateLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0F0A1E]">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="h-16 w-16 rounded-full border-4 border-violet-500/20" />
          <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-t-violet-500 animate-spin" />
        </div>
        <p className="text-sm text-white/40">Loading certificate...</p>
      </div>
    </div>
  );
}
