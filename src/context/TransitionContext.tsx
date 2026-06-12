import React, { createContext, useContext, useRef, useState, useCallback } from 'react';

export type TransitionPhase =
  | 'idle'
  | 'ui-fade'       // UI elements fade out
  | 'heart-collapse' // heart particles collapse to center
  | 'overlay-in'    // black overlay fades in
  | 'terminal'      // terminal text sequence
  | 'done';         // navigate

interface TransitionContextValue {
  phase: TransitionPhase;
  targetRoute: string | null;
  beginTransition: (to: string) => void;
  advancePhase: (next: TransitionPhase) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<TransitionPhase>('idle');
  const [targetRoute, setTargetRoute] = useState<string | null>(null);

  const beginTransition = useCallback((to: string) => {
    setTargetRoute(to);
    setPhase('ui-fade');
  }, []);

  const advancePhase = useCallback((next: TransitionPhase) => {
    setPhase(next);
    if (next === 'idle') {
    setTargetRoute(null);  // ← bersihkan target route juga
  }
  }, []);

  return (
    <TransitionContext.Provider value={{ phase, targetRoute, beginTransition, advancePhase }}>
      {children}
    </TransitionContext.Provider>
  );
}

export function useTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) throw new Error('useTransition must be used within TransitionProvider');
  return ctx;
}