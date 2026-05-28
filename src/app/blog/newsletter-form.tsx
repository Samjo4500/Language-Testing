'use client';

import { useState } from 'react';

export function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 max-w-md mx-auto">
        <p className="text-emerald-400 text-sm font-medium">Newsletter coming soon — thanks for your interest!</p>
        <p className="text-white/30 text-xs">We&apos;ll let you know when we launch.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="flex-1 px-4 py-3 rounded-xl bg-white/[0.05] border border-white/[0.1] text-white text-sm placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all"
      />
      <button
        type="submit"
        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-medium transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:-translate-y-0.5 cursor-pointer whitespace-nowrap"
      >
        Subscribe
      </button>
    </form>
  );
}
