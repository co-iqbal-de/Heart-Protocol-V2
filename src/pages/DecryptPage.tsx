import React, { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Typewriter from '../components/Typewriter';

const unlockAudio = () => {
  const audio = new Audio('/Lord_Huron-The_Night_We_Met.mp3');

  audio.volume = 0;

  audio.play()
    .then(() => {
      audio.pause();
      audio.currentTime = 0;
    })
    .catch(() => {});
}

export default function DecryptPage() {
  const [consoleFinished, setConsoleFinished] = useState(false);
  const navigate = useNavigate();

  const handleReveal = useCallback(() => {
    if (!consoleFinished) {
      unlockAudio();
      navigate('/heart');
    }
  }, [consoleFinished, navigate]);

  return (
    <div 
      onClick={handleReveal}
      className={`relative min-h-screen w-full flex items-center justify-center bg-[#050505] selection:bg-pink-deep/30 ${consoleFinished ? 'cursor-pointer' : ''}`}
    >
      <div className="scanline" />

      <motion.div
        key="console"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-2xl p-8 font-mono text-sm md:text-base text-white/80"
      >
        <div className="space-y-2">
          <div className="flex gap-2 text-pink-soft/60">
            <span>[system]</span>
            <Typewriter 
              text="Initializing Heart.PROTOCOL_v2.For_You.exe" 
              delay={30} 
              onComplete={() => setConsoleFinished(true)}
            />
          </div>

          <div className="flex gap-2 h-6">
            <span>[status]</span>
            {consoleFinished && (
                <motion.span 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    className="text-green-400"
                >
                    READY
                </motion.span>
            )}
          </div>

          {consoleFinished && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="pt-8 flex flex-col items-start gap-6"
            >
              <p className="text-white/40 italic">
                {">"} One special encrypted package found for you.
              </p>
              
              <button
                id="decrypt-button"
                onClick={(e) => {
                  e.stopPropagation();
                  unlockAudio();
                  navigate('/heart');
                }}
                className="group flex items-center gap-3 px-6 py-3 border border-pink-deep/30 bg-pink-deep/5 hover:bg-pink-deep/10 text-pink-soft transition-all duration-300 pointer-events-auto"
              >
                <Lock size={16} className="group-hover:rotate-12 transition-transform" />
                <span className="font-mono tracking-widest uppercase text-xs">Click Here</span>
                <span className="terminal-cursor" />
              </button>
              
              <p className="text-[10px] text-white/20 animate-pulse">
                (or just click anywhere)
              </p>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
