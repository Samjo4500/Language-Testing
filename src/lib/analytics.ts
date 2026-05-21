/**
 * Analytics Utility Module — GA4 + PostHog
 *
 * Central place for all tracking calls. Each function is safe to call
 * even when the scripts haven't loaded yet (graceful no-op).
 *
 * Environment variables required:
 *   NEXT_PUBLIC_GA_MEASUREMENT_ID   — e.g. "G-XXXXXXXXXX"
 *   NEXT_PUBLIC_POSTHOG_KEY         — e.g. "phc_xxxxxxxxxxxx"
 *   NEXT_PUBLIC_POSTHOG_HOST        — e.g. "https://us.i.posthog.com"
 *   GA_API_SECRET                   — for server-side Measurement Protocol (not NEXT_PUBLIC)
 */

// ────────────────────────────────────────────
// GA4 client-side helpers
// ────────────────────────────────────────────

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag(...args);
  }
}

/** Track a custom GA4 event with optional parameters */
export function trackEvent(eventName: string, params?: Record<string, unknown>) {
  gtag('event', eventName, params);
  // Also capture in PostHog if available
  if (typeof window !== 'undefined' && (window as any).posthog?.capture) {
    (window as any).posthog.capture(eventName, params);
  }
}

// ────────────────────────────────────────────
// Typed event helpers
// ────────────────────────────────────────────

/** User clicked "Start Free Test" or started an assessment */
export function trackTestStart(params?: { plan?: string; is_resume?: boolean }) {
  trackEvent('test_start', {
    plan: params?.plan,
    is_resume: params?.is_resume ?? false,
  });
}

/** User completed and submitted the full assessment */
export function trackTestComplete(params: { cefr_level?: string; score?: number; duration_seconds?: number }) {
  trackEvent('test_complete', params);
}

/** User abandoned the test mid-way (fires via sendBeacon on beforeunload) */
export function trackTestAbandon(params: { step: string; skills_completed: number; skills_total: number }) {
  trackEvent('test_abandon', params);
}

/** Account registration completed */
export function trackAccountCreate(params?: { account_type?: string }) {
  trackEvent('account_create', {
    account_type: params?.account_type,
  });
}

/** Purchase completed (client-side, fires from PayPal onApprove callback) */
export function trackPurchase(params: { transaction_id: string; value: number; currency: string; plan_type: string; items?: string }) {
  trackEvent('purchase', {
    transaction_id: params.transaction_id,
    value: params.value,
    currency: params.currency,
    plan_type: params.plan_type,
    items: params.items,
  });
}

/** Speaking demo mic button clicked */
export function trackSpeakingDemoStart(params: { mic_permission: 'granted' | 'denied' | 'not_requested' }) {
  trackEvent('speaking_demo_start', params);
}

/** Speaking demo finished showing results */
export function trackSpeakingDemoComplete() {
  trackEvent('speaking_demo_complete');
}

/** Pricing section scrolled into view */
export function trackPricingView() {
  trackEvent('pricing_view');
}

/** Certificate PDF download clicked */
export function trackCertificateDownload(params?: { cefr_level?: string }) {
  trackEvent('certificate_download', {
    cefr_level: params?.cefr_level,
  });
}

// ────────────────────────────────────────────
// Server-side GA4 Measurement Protocol
// ────────────────────────────────────────────

/**
 * Send a GA4 event from the server using the Measurement Protocol.
 * Use this for purchase events that must not be blocked by ad-blockers.
 *
 * @see https://developers.google.com/analytics/mdev/protocol/v2
 */
export async function trackPurchaseServerSide(params: {
  measurementId: string;
  apiSecret: string;
  clientId: string;
  transactionId: string;
  value: number;
  currency: string;
  planType: string;
  userId?: string;
}) {
  const { measurementId, apiSecret, clientId, transactionId, value, currency, planType, userId } = params;

  if (!measurementId || !apiSecret) {
    // Silently skip if not configured — dev environments won't have these
    return;
  }

  const payload = {
    client_id: clientId,
    user_id: userId,
    events: [
      {
        name: 'purchase',
        params: {
          transaction_id: transactionId,
          value,
          currency,
          plan_type: planType,
          items: planType,
        },
      },
    ],
  };

  try {
    const res = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${measurementId}&api_secret=${apiSecret}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );
    if (!res.ok) {
      console.error('GA4 MP: server-side purchase tracking failed', res.status);
    }
  } catch (err) {
    console.error('GA4 MP: network error', err);
  }
}

// ────────────────────────────────────────────
// PostHog identify helper
// ────────────────────────────────────────────

/** Identify a user in PostHog after login/register */
export function identifyUser(userId: string, traits?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && (window as any).posthog?.identify) {
    (window as any).posthog.identify(userId, traits);
  }
}

/** Reset PostHog identity on logout */
export function resetIdentity() {
  if (typeof window !== 'undefined' && (window as any).posthog?.reset) {
    (window as any).posthog.reset();
  }
}
