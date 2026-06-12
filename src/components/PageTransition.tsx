import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useTransition } from '../context/TransitionContext.tsx';

// ── Timing constants (ms) ─────────────────────────────────────────────────────
const T_UI_FADE        = 900;   // how long UI elements take to vanish
const T_HEART_COLLAPSE = 1400;  // heart collapse duration
const T_OVERLAY_IN     = 400;   // black overlay fade-in
const T_LINE1_DELAY    = 300;   // "opening archive..." appears
const T_LINE2_DELAY    = 1000;  // "decrypting memories..."
const T_LINE3_DELAY    = 1900;  // "ACCESS GRANTED"
const T_NAVIGATE_DELAY = 2900;  // navigate after ACCESS GRANTED is readable

// ── Typewriter hook ───────────────────────────────────────────────────────────
function useTypewriter(text: string, active: boolean, charDelay = 38) {
  const [displayed, setDisplayed] = useState('');
  useEffect(() => {
    if (!active) { setDisplayed(''); return; }
    let i = 0;
    setDisplayed('');
    const id = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, charDelay);
    return () => clearInterval(id);
  }, [active, text, charDelay]);
  return displayed;
}

// ── Terminal line component ───────────────────────────────────────────────────
function TerminalLine({
  text,
  delay,
  active,
  dim = false,
  accent = false,
}: {
  text: string;
  delay: number;
  active: boolean;
  dim?: boolean;
  accent?: boolean;
}) {
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!active) { setStarted(false); return; }
    const id = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(id);
  }, [active, delay]);

  const typed = useTypewriter(text, started, accent ? 55 : 38);

  return (
    <motion.p
      initial={{ opacity: 0 }}
      animate={{ opacity: started ? 1 : 0 }}
      transition={{ duration: 0.3 }}
      style={{
        fontFamily: '"Fira Code", "Courier New", monospace',
        fontSize: accent ? 13 : 11,
        letterSpacing: accent ? '0.35em' : '0.25em',
        textTransform: 'uppercase',
        color: accent
          ? 'rgba(255,180,200,0.95)'
          : dim
          ? 'rgba(255,255,255,0.3)'
          : 'rgba(255,150,180,0.75)',
        margin: '6px 0',
        lineHeight: 1.6,
        minHeight: '1.6em',
      }}
    >
      {typed}
      {started && typed.length < text.length && (
        <span style={{ opacity: 0.7, animation: 'blink 0.7s step-end infinite' }}>▋</span>
      )}
    </motion.p>
  );
}

// ── Main PageTransition component ─────────────────────────────────────────────
export default function PageTransition() {
  const { phase, targetRoute, advancePhase } = useTransition();
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isActive = phase !== 'idle';
  const showOverlay = phase === 'overlay-in' || phase === 'terminal' || phase === 'done';
  const showTerminal = phase === 'terminal' || phase === 'done';

  // Phase orchestration
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (phase === 'ui-fade') {
      // After UI has faded + heart starts collapsing, move to overlay
      timerRef.current = setTimeout(() => advancePhase('heart-collapse'), T_UI_FADE);
    }

    if (phase === 'heart-collapse') {
      timerRef.current = setTimeout(() => advancePhase('overlay-in'), T_HEART_COLLAPSE * 0.7);
    }

    if (phase === 'overlay-in') {
      timerRef.current = setTimeout(() => advancePhase('terminal'), T_OVERLAY_IN + 100);
    }

    if (phase === 'terminal') {
      timerRef.current = setTimeout(() => {
        advancePhase('done');
        if (targetRoute) navigate(targetRoute);
        setTimeout(() => advancePhase('idle'), 100);
      }, T_NAVIGATE_DELAY);
    }

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [phase, targetRoute, advancePhase, navigate]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          key="transition-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: T_OVERLAY_IN / 1000, ease: 'easeInOut' }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: '#000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {showTerminal && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ textAlign: 'center', userSelect: 'none' }}
            >
              {/* Subtle top rule */}
              <div style={{
                width: 120,
                height: 1,
                background: 'rgba(255,150,180,0.15)',
                margin: '0 auto 24px',
              }} />

              <TerminalLine text="opening archive..." delay={T_LINE1_DELAY} active={showTerminal} dim />
              <TerminalLine text="decrypting memories..." delay={T_LINE2_DELAY} active={showTerminal} dim />

              {/* Animated progress bar */}
              <motion.div
                style={{
                  margin: '20px auto',
                  height: 1,
                  width: 140,
                  background: 'rgba(255,150,180,0.12)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  initial={{ scaleX: 0, transformOrigin: 'left' }}
                  animate={{ scaleX: [0, 1, 0] }}
                  transition={{
                    delay: T_LINE2_DELAY / 1000 + 0.3,
                    duration: 0.9,
                    ease: 'easeInOut',
                  }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'rgba(255,150,180,0.6)',
                    transformOrigin: 'left',
                  }}
                />
              </motion.div>

              <TerminalLine
                text="ACCESS GRANTED"
                delay={T_LINE3_DELAY}
                active={showTerminal}
                accent
              />

              {/* Subtle bottom rule */}
              <div style={{
                width: 120,
                height: 1,
                background: 'rgba(255,150,180,0.15)',
                margin: '24px auto 0',
              }} />
            </motion.div>
          )}

          {/* Blink keyframe */}
          <style>{`
            @keyframes blink {
              0%, 100% { opacity: 1; }
              50% { opacity: 0; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}