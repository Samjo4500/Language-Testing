import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0F0A1E] px-4 relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="orb orb-purple w-[500px] h-[500px] -top-32 -left-32 animate-float-slow" />
        <div className="orb orb-pink w-[300px] h-[300px] bottom-0 right-1/4 animate-float-reverse" />
        <div className="orb orb-blue w-[200px] h-[200px] top-1/2 left-1/3 animate-float" />
      </div>

      <div className="relative text-center max-w-lg mx-auto">
        {/* 404 number */}
        <div className="mb-6">
          <span className="text-8xl sm:text-9xl font-bold gradient-text-static">404</span>
        </div>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/20">
            <Search className="h-10 w-10 text-purple-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-3">
          Page Not Found
        </h1>

        {/* Description */}
        <p className="text-white/50 text-base mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let us help you find your way back to assessing your English proficiency.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <button className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-500 hover:to-pink-400 text-white font-semibold text-sm transition-all duration-300 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto">
              <Home className="h-4 w-4" />
              Go Home
            </button>
          </Link>
          <Link href="/test">
            <button className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 glass-button text-white font-medium text-sm cursor-pointer w-full sm:w-auto">
              <ArrowLeft className="h-4 w-4" />
              Take a Test
            </button>
          </Link>
        </div>

        {/* Helpful links */}
        <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/pricing" className="text-purple-400 hover:text-purple-300 transition-colors">Pricing</Link>
          <span className="text-white/20">|</span>
          <Link href="/about" className="text-purple-400 hover:text-purple-300 transition-colors">About</Link>
          <span className="text-white/20">|</span>
          <Link href="/contact" className="text-purple-400 hover:text-purple-300 transition-colors">Contact</Link>
          <span className="text-white/20">|</span>
          <Link href="/login" className="text-purple-400 hover:text-purple-300 transition-colors">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
