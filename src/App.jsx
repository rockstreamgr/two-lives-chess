import { useState, useCallback, useRef } from 'react';
import { AnimatePresence, motion, LayoutGroup } from 'framer-motion';
import HeroSection from './components/HeroSection';
import GamePanel from './components/GamePanel';
import PrivacyPolicy from './components/PrivacyPolicy';
import Footer from './components/Footer';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function App() {
  const [view, setView] = useState('hero'); // 'hero' | 'game' | 'privacy'
  const [isSplit, setIsSplit] = useState(false);
  const [splitFen, setSplitFen] = useState(null);
  const gameRef = useRef(null);

  /* Enter game from hero */
  const handleStart = useCallback(() => setView('game'), []);

  /* Split the timeline */
  const handleSplit = useCallback((fen) => {
    setSplitFen(fen);
    setIsSplit(true);
  }, []);

  /* Merge back to single board (reset) */
  const handleMerge = useCallback(() => {
    setIsSplit(false);
    setSplitFen(null);
  }, []);

  /* Back to hero */
  const handleGoHome = useCallback(() => {
    setView('hero');
    setIsSplit(false);
    setSplitFen(null);
  }, []);

  /* Privacy */
  const handlePrivacy = useCallback(() => setView('privacy'), []);

  return (
    <div className="relative min-h-screen flex flex-col">
      <div className="flex-1">
        <AnimatePresence mode="wait">
          {view === 'hero' && (
            <motion.div
              key="hero"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.45 }}
            >
              <HeroSection onStart={handleStart} />
            </motion.div>
          )}

          {view === 'privacy' && (
            <motion.div
              key="privacy"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
            >
              <PrivacyPolicy onBack={handleGoHome} />
            </motion.div>
          )}

          {view === 'game' && (
            <motion.div
              key="game"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.45 }}
              className="min-h-screen py-8 px-4 sm:px-8"
            >
              {/* Top bar */}
              <div className="max-w-7xl mx-auto flex items-center justify-between mb-6">
                <button
                  onClick={handleGoHome}
                  className="glass-sm flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
                >
                  <ArrowLeft size={16} />
                  Home
                </button>

                <h2 className="text-sm font-bold tracking-widest uppercase text-white/40 flex items-center gap-2">
                  <Sparkles size={14} className="text-cyan-400" />
                  {isSplit ? 'Two Lives Active' : 'Two Lives Chess'}
                </h2>

                {isSplit && (
                  <button
                    onClick={handleMerge}
                    className="glass-sm flex items-center gap-2 px-4 py-2 text-sm text-white/60 hover:text-white transition-colors"
                  >
                    Merge Back
                  </button>
                )}
                {!isSplit && <div />}
              </div>

              {/* Board(s) */}
              <LayoutGroup>
                <div
                  className={`max-w-7xl mx-auto ${isSplit
                    ? 'split-boards'
                    : 'grid grid-cols-1 max-w-xl mx-auto gap-6'
                    }`}
                >
                  <GamePanel
                    key="main"
                    id="main-board"
                    label={isSplit ? 'Life A — Cyan Timeline' : null}
                    colorClass={isSplit ? 'life-a' : ''}
                    fen={isSplit ? splitFen : undefined}
                    onSplit={isSplit ? undefined : handleSplit}
                  />

                  <AnimatePresence>
                    {isSplit && (
                      <motion.div
                        key="split-board"
                        initial={{ opacity: 0, x: 80, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 80, scale: 0.9 }}
                        transition={{ type: 'spring', stiffness: 180, damping: 22 }}
                      >
                        <GamePanel
                          id="split-board"
                          label="Life B — Magenta Timeline"
                          colorClass="life-b"
                          fen={splitFen}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </LayoutGroup>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer — visible on all views */}
      <Footer onPrivacy={handlePrivacy} />
    </div>
  );
}
