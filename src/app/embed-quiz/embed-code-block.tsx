'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

const EMBED_CODE = `<div id="testcefr-quiz"></div>
<script src="https://testcefr.com/quiz-widget.js" async></script>`;

export function EmbedCodeBlock() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMBED_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = EMBED_CODE;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative">
      <div className="rounded-xl bg-black/40 border border-white/[0.08] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.06] bg-white/[0.02]">
          <span className="text-xs text-white/30 font-mono">HTML</span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy code</span>
              </>
            )}
          </button>
        </div>
        <pre className="p-4 text-sm text-blue-300 font-mono overflow-x-auto leading-relaxed">
          <code>{EMBED_CODE}</code>
        </pre>
      </div>
    </div>
  );
}
