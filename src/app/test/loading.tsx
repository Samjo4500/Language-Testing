import { Navbar } from '@/components/navbar';
import { Loader2 } from 'lucide-react';

export default function TestLoading() {
  return (
    <div className="min-h-screen flex flex-col bg-[#0F0A1E]">
      <Navbar />
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-purple-500/20" />
            <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-transparent border-t-purple-500 animate-spin" />
          </div>
          <p className="text-sm text-white/40">Preparing test...</p>
        </div>
      </div>
    </div>
  );
}
