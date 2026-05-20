'use client';

import { useSyncExternalStore } from 'react';

/**
 * useHydrated — returns `true` only on the client after hydration.
 *
 * Uses useSyncExternalStore (React 18+) so there is no extra setState
 * call inside an effect, which avoids the Next.js 16
 * `react-hooks/set-state-in-effect` lint error.
 */
const emptySubscribe = () => () => {};

export function useHydrated(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,  // client snapshot — always true once JS runs
    () => false, // server snapshot — always false during SSR
  );
}
