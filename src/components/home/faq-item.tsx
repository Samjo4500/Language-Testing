'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="glass-card overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left cursor-pointer group"
      >
        <span className="text-base font-medium text-white group-hover:text-blue-300 transition-colors pr-4">{question}</span>
        <ChevronDown className={`h-5 w-5 text-blue-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="px-5 pb-5 animate-slide-down">
          <p className="text-sm text-white/60 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
