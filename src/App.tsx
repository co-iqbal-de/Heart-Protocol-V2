import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'motion/react';
import DecryptPage from './pages/DecryptPage';
import HeartPage from './pages/HeartPage';
import MemoryPage from './pages/MemoryPage';
import { TransitionProvider } from './context/TransitionContext.tsx';
import PageTransition from './components/PageTransition.tsx';

// ── MemoryPage is wrapped so it fades in from below ───────────────────────────
function MemoryPageWrapper() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
      style={{ width: '100%', minHeight: '100vh' }}
    >
      <MemoryPage />
    </motion.div>
  );
}

function AnimatedRoutes() {
  const location = useLocation();

  return (
    // mode="wait" so the outgoing page fully unmounts before incoming mounts
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<DecryptPage />} />
        <Route path="/heart" element={<HeartPage />} />
        <Route path="/memory" element={<MemoryPageWrapper />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    // TransitionProvider wraps everything so both HeartPage and PageTransition
    // share the same transition state without prop-drilling or duplication.
    <TransitionProvider>
      <AnimatedRoutes />
      {/* PageTransition is always mounted so it can respond to phase changes
          from any route and render the overlay above everything. */}
      <PageTransition />
    </TransitionProvider>
  );
}