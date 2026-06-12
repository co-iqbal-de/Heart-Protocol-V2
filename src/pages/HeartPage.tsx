import React from 'react';
import { motion } from 'motion/react';
import TextHeart from '../components/TextHeart';
import { useNavigate } from 'react-router-dom';
import { useTransition } from '../context/TransitionContext.tsx';

export default function HeartPage() {
  const { phase, beginTransition } = useTransition();
  const isTransitioning = phase !== 'idle';

  const handleAccessMemory = () => {
    if (isTransitioning) return;
    beginTransition('/memory');
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden bg-[#050505] selection:bg-pink-deep/30">

      <TextHeart />

      {/* All UI fades out during ui-fade phase */}
      <motion.div
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        className="z-20 text-center"
        style={{ pointerEvents: isTransitioning ? 'none' : 'auto' }}
      >
        <motion.h2
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 3, duration: 1.5 }}
          className="text-white font-mono text-xl tracking-[0.3em] uppercase glow-text mb-2"
        >
          This is ur day my love 
        </motion.h2>

        <div className="w-12 h-px bg-pink-deep/30 mx-auto mb-8" />

        {/* Memory button */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 5, duration: 1.2, ease: 'easeOut' }}
          className="mb-8 flex flex-col items-center gap-3"
        >
          <p className="text-white/25 font-mono text-[9px] tracking-[0.3em] uppercase">
            ✦ a memory made just for you ✦
          </p>

          <motion.button
            style={{ cursor: isTransitioning ? 'wait' : 'pointer' }}
            disabled={isTransitioning}
            onClick={handleAccessMemory}
            whileHover={isTransitioning ? {} : {
              scale: 1.03,
              boxShadow: '0 0 35px rgba(212,72,142,.35)',
              borderColor: '#ff78b4',
            }}
            whileTap={isTransitioning ? {} : { scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="
              group relative overflow-hidden rounded-full
              border border-pink-500/30 bg-white/3 backdrop-blur-md
              px-8 py-3 font-mono uppercase tracking-[0.35em] text-[11px]
              text-pink-100 transition-all duration-300
            "
          >
            {/* Scanner — accelerates when transitioning */}
            <motion.div
              className="absolute inset-0 bg-linear-to-r from-transparent via-pink-400/20 to-transparent"
              animate={{ x: ['-150%', '150%'] }}
              transition={{
                repeat: Infinity,
                duration: isTransitioning ? 0.45 : 2.8,
                ease: 'linear',
              }}
            />

            <div className="absolute inset-0 rounded-full border border-pink-400/0 group-hover:border-pink-300/40 transition-all duration-500" />
            <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-pink-400/3" />

            <span className="relative z-10 flex items-center gap-3">
              <span className="text-pink-400/80">◆</span>

              {isTransitioning ? 'ACCESSING...' : 'ACCESS MEMORY'}

              <motion.span
                className="text-pink-300"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.6 }}
              >
                →
              </motion.span>
            </span>
          </motion.button>
        </motion.div>

        <motion.button
          onClick={() => window.history.back()}
          className="text-white/20 hover:text-white/60 transition-colors uppercase text-[10px] tracking-widest font-mono"
        >
          Re-encrypt
        </motion.button>
      </motion.div>

      {/* Debug decorations — fade with UI */}
      <motion.div
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        className="absolute top-8 left-8 text-[10px] font-mono text-white/10 uppercase tracking-widest space-y-1"
        style={{ pointerEvents: 'none' }}
      >
        <div>ln: 420</div>
        <div>id: 0xDEADBEEF</div>
        <div>type: organic_emotion</div>
      </motion.div>

      <motion.div
        animate={{ opacity: isTransitioning ? 0 : 1 }}
        transition={{ duration: 0.9, ease: 'easeInOut' }}
        className="absolute bottom-8 right-8 text-[10px] font-mono text-white/10 uppercase tracking-widest"
        style={{ pointerEvents: 'none' }}
      >
        heart_reveal // success
      </motion.div>

    </div>
  );
}
