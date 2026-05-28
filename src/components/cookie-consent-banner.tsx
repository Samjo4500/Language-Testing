'use client';

import { useState, useEffect, useCallback } from 'react';
import { Cookie, Shield, BarChart3, Settings, Globe, X, ChevronDown, ChevronUp, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

type CookiePreferences = {
  essential: boolean; // always true
  analytics: boolean;
  functionality: boolean;
  marketing: boolean;
};

const COOKIE_CONSENT_KEY = 'cookie-consent';
const COOKIE_CONSENT_VERSION = 1;

function getStoredConsent(): { preferences: CookiePreferences; version: number } | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!stored) return null;
    const parsed = JSON.parse(stored);
    if (parsed.version !== COOKIE_CONSENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function storeConsent(preferences: CookiePreferences) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify({
    preferences,
    version: COOKIE_CONSENT_VERSION,
    timestamp: new Date().toISOString(),
  }));
  // Also set a cookie so server-side can check
  document.cookie = `cookie-consent=${encodeURIComponent(JSON.stringify(preferences))}; path=/; max-age=${365 * 24 * 60 * 60}; SameSite=Lax`;
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    functionality: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if consent has already been given
    const stored = getStoredConsent();
    if (!stored) {
      // Show banner after a short delay so it doesn't flash on page load
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = useCallback(() => {
    const allAccepted: CookiePreferences = {
      essential: true,
      analytics: true,
      functionality: true,
      marketing: true,
    };
    storeConsent(allAccepted);
    setVisible(false);
  }, []);

  const handleRejectAll = useCallback(() => {
    const onlyEssential: CookiePreferences = {
      essential: true,
      analytics: false,
      functionality: false,
      marketing: false,
    };
    storeConsent(onlyEssential);
    setVisible(false);
  }, []);

  const handleSavePreferences = useCallback(() => {
    storeConsent(preferences);
    setVisible(false);
  }, [preferences]);

  const togglePreference = useCallback((key: keyof CookiePreferences) => {
    if (key === 'essential') return; // Can't disable essential
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 md:p-6 animate-slide-up">
      <div className="max-w-3xl mx-auto">
        <div className="glass-card p-6 md:p-8 border border-white/10 shadow-2xl shadow-black/50">
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-500 text-white shadow-lg">
              <Cookie className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-white mb-1">We value your privacy</h3>
              <p className="text-sm text-white/50 leading-relaxed">
                We use cookies to enhance your browsing experience, serve personalized content, and analyze our traffic. By clicking &ldquo;Accept All&rdquo;, you consent to our use of cookies.{' '}
                <Link href="/cookie-policy" className="text-blue-400 hover:text-blue-300 underline underline-offset-2">
                  Read our Cookie Policy
                </Link>
              </p>
            </div>
            <button
              onClick={() => { handleRejectAll(); }}
              className="text-white/30 hover:text-white/60 transition-colors p-1 shrink-0"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Expandable Details */}
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1.5 text-sm text-violet-400 hover:text-violet-300 transition-colors mb-3"
          >
            {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            {showDetails ? 'Hide details' : 'Customize preferences'}
          </button>

          {showDetails && (
            <div className="space-y-3 mb-5 animate-slide-down">
              {/* Essential */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <button
                  className="flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 border-blue-500 bg-blue-500/20 cursor-default"
                  aria-label="Essential cookies always enabled"
                >
                  <svg className="h-3 w-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                <Shield className="h-4 w-4 text-red-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Essential</p>
                  <p className="text-xs text-white/40">Required for authentication, security, and basic functionality. Cannot be disabled.</p>
                </div>
                <span className="text-[10px] font-semibold tracking-wide uppercase px-1.5 py-0.5 rounded bg-red-500/15 text-red-400 shrink-0">Always On</span>
              </div>

              {/* Analytics */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.05] cursor-pointer hover:bg-white/[0.05] transition-colors" onClick={() => togglePreference('analytics')}>
                <button
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    preferences.analytics ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 bg-transparent'
                  }`}
                  aria-label="Toggle analytics cookies"
                >
                  {preferences.analytics && (
                    <svg className="h-3 w-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <BarChart3 className="h-4 w-4 text-blue-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Analytics</p>
                  <p className="text-xs text-white/40">Help us understand how visitors use the platform. All data is anonymized.</p>
                </div>
              </div>

              {/* Functionality */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.05] cursor-pointer hover:bg-white/[0.05] transition-colors" onClick={() => togglePreference('functionality')}>
                <button
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    preferences.functionality ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 bg-transparent'
                  }`}
                  aria-label="Toggle functionality cookies"
                >
                  {preferences.functionality && (
                    <svg className="h-3 w-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <Settings className="h-4 w-4 text-green-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Functionality</p>
                  <p className="text-xs text-white/40">Remember your preferences like language, theme, and CEFR level.</p>
                </div>
              </div>

              {/* Marketing */}
              <div className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.05] cursor-pointer hover:bg-white/[0.05] transition-colors" onClick={() => togglePreference('marketing')}>
                <button
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors ${
                    preferences.marketing ? 'border-blue-500 bg-blue-500/20' : 'border-white/20 bg-transparent'
                  }`}
                  aria-label="Toggle marketing cookies"
                >
                  {preferences.marketing && (
                    <svg className="h-3 w-3 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
                <Globe className="h-4 w-4 text-violet-400 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">Marketing</p>
                  <p className="text-xs text-white/40">Used for targeted advertising and measuring campaign effectiveness.</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleAcceptAll}
              className="flex-1 rounded-xl py-2.5 px-5 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 cursor-pointer"
            >
              Accept All
            </button>
            {showDetails ? (
              <button
                onClick={handleSavePreferences}
                className="flex-1 rounded-xl py-2.5 px-5 bg-white/10 hover:bg-white/15 border border-white/20 text-white text-sm font-medium transition-all duration-300 cursor-pointer"
              >
                Save Preferences
              </button>
            ) : null}
            <button
              onClick={handleRejectAll}
              className="flex-1 rounded-xl py-2.5 px-5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-white/60 hover:text-white/80 text-sm font-medium transition-all duration-300 cursor-pointer"
            >
              Reject Non-Essential
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
